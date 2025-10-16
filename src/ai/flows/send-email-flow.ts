'use server';
/**
 * @fileOverview A flow for sending email notifications.
 *
 * - sendEmail - A function that sends an email using nodemailer.
 * - SendEmailInput - The input type for the sendEmail function.
 * - SendEmailOutput - The return type for the sendEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import nodemailer from 'nodemailer';

export const SendEmailInputSchema = z.object({
  to: z.string().email().describe("The recipient's email address."),
  subject: z.string().describe('The subject of the email.'),
  body: z.string().describe('The body content of the email.'),
});
export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;

export const SendEmailOutputSchema = z.object({
  success: z.boolean().describe('Whether the email was sent successfully.'),
});
export type SendEmailOutput = z.infer<typeof SendEmailOutputSchema>;

export async function sendEmail(input: SendEmailInput): Promise<SendEmailOutput> {
  const sendEmailFlow = ai.defineFlow(
    {
      name: 'sendEmailFlow',
      inputSchema: SendEmailInputSchema,
      outputSchema: SendEmailOutputSchema,
    },
    async (input) => {
      
      const { EMAIL_USER, EMAIL_APP_PASSWORD } = process.env;

      if (!EMAIL_USER || !EMAIL_APP_PASSWORD) {
        console.error('Email credentials are not set in environment variables.');
        return { success: false };
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: EMAIL_USER,
        to: input.to,
        subject: input.subject,
        text: input.body,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${input.to}`);
        return { success: true };
      } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false };
      }
    }
  );

  return await sendEmailFlow(input);
}
