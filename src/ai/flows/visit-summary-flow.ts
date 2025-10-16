'use server';
/**
 * @fileOverview An AI agent that generates a structured clinical visit summary from unstructured notes.
 *
 * - generateVisitSummary - The main function to call the flow.
 * - VisitSummaryInput - The input type for the flow.
 * - VisitSummaryOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Zod schema for the input: unstructured clinical notes.
export const VisitSummaryInputSchema = z.object({
  notes: z.string().describe('Unstructured clinical notes from a patient visit, which may include symptoms, doctor\'s observations, diagnosis, and treatment plan.'),
});
export type VisitSummaryInput = z.infer<typeof VisitSummaryInputSchema>;

// Zod schema for the structured output.
export const VisitSummaryOutputSchema = z.object({
  subjective: z.string().describe("The patient's reported symptoms and history (Subjective)."),
  objective: z.string().describe('The clinician\'s objective findings from the examination (Objective).'),
  assessment: z.string().describe('The clinician\'s assessment and diagnosis (Assessment).'),
  plan: z.string().describe('The treatment and follow-up plan (Plan).'),
});
export type VisitSummaryOutput = z.infer<typeof VisitSummaryOutputSchema>;

// The main exported function that clients will call.
export async function generateVisitSummary(input: VisitSummaryInput): Promise<VisitSummaryOutput> {
  return await visitSummaryFlow(input);
}

// Genkit prompt definition.
const visitSummaryPrompt = ai.definePrompt({
  name: 'visitSummaryPrompt',
  input: { schema: VisitSummaryInputSchema },
  output: { schema: VisitSummaryOutputSchema },
  prompt: `You are a highly skilled medical scribe. Your task is to transform unstructured clinical notes into a structured SOAP (Subjective, Objective, Assessment, Plan) format.
  
  Analyze the following clinical notes and extract the relevant information for each section of the SOAP note.

  Clinical Notes:
  {{{notes}}}
  
  Please provide the output in a clean, well-organized JSON format conforming to the defined schema.`,
});

// Genkit flow definition.
const visitSummaryFlow = ai.defineFlow(
  {
    name: 'visitSummaryFlow',
    inputSchema: VisitSummaryInputSchema,
    outputSchema: VisitSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await visitSummaryPrompt(input);
    if (!output) {
      throw new Error('Failed to generate visit summary.');
    }
    return output;
  }
);
