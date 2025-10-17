
'use server';
/**
 * @fileOverview A voice-based AI triage agent that transcribes user audio, evaluates symptoms, and provides a spoken response.
 *
 * - voiceTriage - A function that handles the entire voice triage process.
 * - VoiceTriageInput - The input type for the voiceTriage function.
 * - VoiceTriageOutput - The return type for the voiceTriage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { evaluateSymptoms } from './symptom-evaluator';
import wav from 'wav';

// This schema was previously imported, but to comply with 'use server' restrictions,
// it's now defined directly in this file.
const SymptomEvaluationOutputSchema = z.object({
  potentialDiagnoses: z.array(z.string()).describe('A list of potential diagnoses based on the provided information.'),
  severityAssessment: z.string().describe('An assessment of the severity of the patient\'s condition (e.g., mild, moderate, severe).'),
  recommendedDepartment: z.string().describe('The recommended medical department for further evaluation and treatment (e.g., Cardiology, Neurology, Emergency).'),
  chronicProbability: z.number().min(0).max(1).describe('The probability (0 to 1) that the condition is chronic, based on symptom duration and other details. Generally, durations over 21-30 days suggest a higher probability.'),
  additionalRecommendations: z.string().optional().describe('Any additional recommendations or advice for the patient.'),
});

// Define the input schema for the voice triage flow, which includes the audio data URI and patient's age.
const VoiceTriageInputSchema = z.object({
  audioDataUri: z.string().describe("A base64 encoded audio blob as a data URI. Expected format: 'data:audio/webm;base64,<encoded_data>'."),
  age: z.number().describe('The age of the patient.'),
  // We've added duration to be passed to the symptom evaluator, but we'll default it here.
});
export type VoiceTriageInput = z.infer<typeof VoiceTriageInputSchema>;

// Define the output schema, which includes the AI's spoken response and the structured symptom evaluation.
const VoiceTriageOutputSchema = z.object({
  audioResponseUri: z.string().describe("The AI's spoken response as a base64 encoded audio data URI."),
  evaluation: SymptomEvaluationOutputSchema.describe('The structured evaluation of the patient\'s symptoms.'),
});
export type VoiceTriageOutput = z.infer<typeof VoiceTriageOutputSchema>;

// The main exported function that orchestrates the voice triage process.
export async function voiceTriage(input: VoiceTriageInput): Promise<VoiceTriageOutput> {
  return await voiceTriageFlow(input);
}

// Define the text-to-speech flow using Genkit.
const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (text) => {
    // Generate audio from the input text using the specified TTS model.
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: text,
    });
    
    if (!media?.url) {
      throw new Error('Text-to-speech generation failed to return audio.');
    }
    
    // Convert the raw PCM audio data to WAV format.
    const pcmData = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    const wavData = await toWav(pcmData);
    
    // Return the audio as a data URI.
    return `data:audio/wav;base64,${wavData}`;
  }
);

// Define the main voice triage flow using Genkit.
const voiceTriageFlow = ai.defineFlow(
  {
    name: 'voiceTriageFlow',
    inputSchema: VoiceTriageInputSchema,
    outputSchema: VoiceTriageOutputSchema,
  },
  async ({ audioDataUri, age }) => {
    // 1. Transcribe the user's audio to text.
    const { text: symptoms } = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      prompt: [{ media: { url: audioDataUri } }],
    });

    if (!symptoms) {
      throw new Error('Failed to transcribe audio.');
    }

    // 2. Evaluate the transcribed symptoms. We'll use a default duration of 1 day.
    const evaluation = await evaluateSymptoms({ symptoms, age, durationInDays: 1 });

    // 3. Create a concise spoken response based on the evaluation.
    const responseText = `Based on the symptoms described, I recommend seeing the ${evaluation.recommendedDepartment} department. The potential diagnosis is ${evaluation.potentialDiagnoses[0]} with a severity of ${evaluation.severityAssessment}. ${evaluation.additionalRecommendations || ''}`;

    // 4. Convert the text response to speech.
    const audioResponseUri = await textToSpeechFlow(responseText);

    // 5. Return the spoken response and the detailed evaluation.
    return {
      audioResponseUri,
      evaluation,
    };
  }
);


// Utility function to convert raw PCM audio data to WAV format.
async function toWav(pcmData: Buffer, channels = 1, rate = 24000, sampleWidth = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));
    
    writer.write(pcmData);
    writer.end();
  });
}
