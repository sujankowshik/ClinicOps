'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { generateVisitSummary, VisitSummaryOutput } from '@/ai/flows/visit-summary-flow';
import { Loader2, Sparkles, Wand } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Patient, Visit } from '@/lib/types';
import { format } from 'date-fns';

const formSchema = z.object({
  notes: z.string().min(10, 'Please enter some notes from the visit.'),
  reason: z.string().min(2, 'Please enter a reason for the visit.'),
});
type FormValues = z.infer<typeof formSchema>;

interface VisitSummaryProps {
    patient: Patient;
    onAddVisit: (visit: Omit<Visit, 'id'>) => void;
}

export function VisitSummary({ patient, onAddVisit }: VisitSummaryProps) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<VisitSummaryOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { notes: '', reason: '' },
  });

  const handleGenerateSummary = async () => {
    const notes = form.getValues('notes');
    if (notes.length < 10) {
        form.setError('notes', { message: 'Please enter at least 10 characters to generate a summary.' });
        return;
    }

    setLoading(true);
    setSummary(null);
    try {
      const result = await generateVisitSummary({ notes });
      setSummary(result);
      form.setValue('notes', `## Subjective\n${result.subjective}\n\n## Objective\n${result.objective}\n\n## Assessment\n${result.assessment}\n\n## Plan\n${result.plan}`);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate summary.' });
    }
    setLoading(false);
  };

  const handleSaveVisit = async (data: FormValues) => {
    const newVisit = {
      patientId: patient.id,
      date: new Date().toISOString(),
      doctor: 'Dr. AI Assistant', // This would be the logged-in doctor in a real app
      reason: data.reason,
      notes: data.notes,
      summary: summary ? JSON.stringify(summary) : undefined,
    };
    onAddVisit(newVisit);
    toast({ title: 'Visit Saved', description: "The patient's visit has been recorded." });
    form.reset();
    setSummary(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">New Visit Note</CardTitle>
        <CardDescription>Record a new visit for {patient.name}. Use the AI summary tool to structure your notes.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSaveVisit)}>
          <CardContent className="space-y-4">
             <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Visit</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Annual Checkup, Follow-up for Hypertension..." {...field} rows={1}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clinical Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter unstructured notes here. e.g., 'Patient reports headache and fatigue for 3 days. BP is 130/85. Advised rest and hydration.'"
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={handleGenerateSummary} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand className="mr-2 h-4 w-4" />}
                    Generate SOAP Notes
                </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit">Save Visit Note</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
