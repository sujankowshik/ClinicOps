'use server';
/**
 * @fileOverview An AI tool that evaluates patient symptoms, age, and other details to provide a potential diagnosis,
 * severity assessment, and recommended medical department.
 *
 * - evaluateSymptoms - A function that handles the symptom evaluation process.
 * - SymptomEvaluationInput - The input type for the evaluateSymptoms function.
 * - SymptomEvaluationOutput - The return type for the evaluateSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomEvaluationInputSchema = z.object({
  symptoms: z.string().describe('A detailed description of the patient\'s symptoms.'),
  age: z.number().describe('The patient\'s age in years.'),
  durationInDays: z.number().describe('The duration of the symptoms in days.'),
  patientDetails: z.string().optional().describe('Any additional relevant information about the patient, such as medical history or existing conditions.'),
});
export type SymptomEvaluationInput = z.infer<typeof SymptomEvaluationInputSchema>;

const SymptomEvaluationOutputSchema = z.object({
  potentialDiagnoses: z.array(z.string()).describe('A list of potential diagnoses based on the provided information.'),
  severityAssessment: z.string().describe('An assessment of the severity of the patient\'s condition (e.g., mild, moderate, severe).'),
  recommendedDepartment: z.string().describe('The recommended medical department for further evaluation and treatment (e.g., Cardiology, Neurology, Emergency).'),
  chronicProbability: z.number().min(0).max(1).describe('The probability (0 to 1) that the condition is chronic, based on symptom duration and other details. Generally, durations over 21-30 days suggest a higher probability.'),
  additionalRecommendations: z.string().optional().describe('Any additional recommendations or advice for the patient.'),
});
export type SymptomEvaluationOutput = z.infer<typeof SymptomEvaluationOutputSchema>;

export async function evaluateSymptoms(input: SymptomEvaluationInput): Promise<SymptomEvaluationOutput> {
  return symptomEvaluationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomEvaluationPrompt',
  input: {schema: SymptomEvaluationInputSchema},
  output: {schema: SymptomEvaluationOutputSchema},
  prompt: `You are an AI-powered medical assistant specializing in evaluating patient symptoms to provide potential diagnoses,
  severity assessments, and recommended medical departments.

  Evaluate the following patient information and provide your analysis:

  Symptoms: {{{symptoms}}}
  Age: {{{age}}}
  Symptom Duration: {{{durationInDays}}} days
  Additional Details: {{{patientDetails}}}

  Based on the provided information, generate a list of potential diagnoses, assess the severity of the condition, and recommend the most appropriate medical department for further evaluation.
  
  Crucially, you must also determine the probability that this is a chronic condition based on the symptom duration and patient details. A chronic condition is typically one that lasts for a long time (e.g., more than 3-4 weeks). A duration of over 21 days should significantly increase the chronicProbability. Return this as a number between 0 (definitely acute) and 1 (definitely chronic).

  Include any additional recommendations or advice that might be helpful.

  Format your output as a JSON object that conforms to the following schema:
  ${JSON.stringify(SymptomEvaluationOutputSchema.describe('The output schema for the symptom evaluation.'))}

  Make sure that potentialDiagnoses is an array of strings.
  `,
});

const symptomEvaluationFlow = ai.defineFlow(
  {
    name: 'symptomEvaluationFlow',
    inputSchema: SymptomEvaluationInputSchema,
    outputSchema: SymptomEvaluationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
