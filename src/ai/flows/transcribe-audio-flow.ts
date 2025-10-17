
'use server';
/**
 * @fileOverview An AI agent that transcribes audio to text.
 *
 * - transcribeAudio - The main function to call the flow.
 * - TranscribeAudioInput - The input type for the flow.
 * - TranscribeAudioOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Zod schema for the input: audio data URI.
const TranscribeAudioInputSchema = z.object({
  audioDataUri: z.string().describe("A base64 encoded audio blob as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

// Zod schema for the structured output.
const TranscribeAudioOutputSchema = z.object({
  text: z.string().describe('The transcribed text from the audio.'),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;

// The main exported function that clients will call.
export async function transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioOutput> {
  return await transcribeAudioFlow(input);
}

// Genkit flow definition.
const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async ({ audioDataUri }) => {
    // Transcribe the user's audio to text.
    const { text } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: [{ media: { url: audioDataUri } }],
    });

    if (text === undefined) {
      throw new Error('Failed to transcribe audio.');
    }

    return { text };
  }
);
