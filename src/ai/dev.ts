import { config } from 'dotenv';
config();

import '@/ai/flows/symptom-evaluator.ts';
import '@/ai/flows/faq-and-triage-assistant.ts';
import '@/ai/flows/send-email-flow.ts';
import '@/ai/flows/voice-triage-flow.ts';
import '@/ai/flows/visit-summary-flow.ts';
