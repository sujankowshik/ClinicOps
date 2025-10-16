'use server';
/**
 * @fileOverview An FAQ and triage assistant AI agent.
 *
 * - faqAndTriageAssistant - A function that handles answering FAQs and triaging complex queries.
 * - FAQAndTriageInput - The input type for the faqAndTriageAssistant function.
 * - FAQAndTriageOutput - The return type for the faqAndTriageAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FAQAndTriageInputSchema = z.object({
  query: z.string().describe('The user query or question.'),
});
export type FAQAndTriageInput = z.infer<typeof FAQAndTriageInputSchema>;

const FAQAndTriageOutputSchema = z.object({
  answer: z.string().describe('The answer to the question, if it is a frequently asked question.'),
  isComplex: z.boolean().describe('Whether the query is complex and requires human attention.'),
  triageInstructions: z.string().describe('Instructions on how to triage the query, if it is complex.'),
});
export type FAQAndTriageOutput = z.infer<typeof FAQAndTriageOutputSchema>;

export async function faqAndTriageAssistant(input: FAQAndTriageInput): Promise<FAQAndTriageOutput> {
  return faqAndTriageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'faqAndTriagePrompt',
  input: {schema: FAQAndTriageInputSchema},
  output: {schema: FAQAndTriageOutputSchema},
  prompt: `You are an AI assistant that answers frequently asked questions and triages complex queries.

  Your goal is to provide quick answers to common questions and direct complex queries to the appropriate support channel.

  If the query can be answered with a frequently asked question, then answer the question in the answer field and set isComplex to false.
  If the query is complex, then set isComplex to true and provide instructions on how to triage the query.

  Query: {{{query}}}`,
});

const faqAndTriageFlow = ai.defineFlow(
  {
    name: 'faqAndTriageFlow',
    inputSchema: FAQAndTriageInputSchema,
    outputSchema: FAQAndTriageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
