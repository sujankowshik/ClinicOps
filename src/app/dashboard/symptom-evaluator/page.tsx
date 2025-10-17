'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  evaluateSymptoms,
  type SymptomEvaluationOutput,
} from '@/ai/flows/symptom-evaluator';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { RadialBar, RadialBarChart, PolarGrid } from 'recharts';

const formSchema = z.object({
  symptoms: z.string().min(10, 'Please provide a detailed description of the symptoms.'),
  age: z.coerce.number().int().positive('Age must be a positive number.'),
  durationInDays: z.coerce.number().int().positive('Duration must be a positive number.'),
  patientDetails: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function SymptomEvaluatorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SymptomEvaluationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: '',
      patientDetails: '',
      age: 0,
      durationInDays: 0,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await evaluateSymptoms(data);
      setResult(response);
    } catch (e) {
      setError('An error occurred while evaluating symptoms. Please try again.');
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Symptom Evaluator</CardTitle>
          <CardDescription>
            Enter patient details to get an AI-powered preliminary evaluation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="symptoms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symptoms</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., persistent cough, fever, and shortness of breath."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient's Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="42" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="durationInDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symptom Duration (Days)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 7" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="patientDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Details (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., history of asthma, non-smoker."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Evaluate Symptoms
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Evaluation Result</CardTitle>
          <CardDescription>
            The AI's assessment will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {loading && (
            <div className="flex h-full flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">AI is thinking...</p>
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className='space-y-4'>
                    <div>
                        <h3 className="font-semibold">Potential Diagnoses</h3>
                        <div className="flex flex-wrap gap-2 pt-2">
                        {result.potentialDiagnoses.map((diag, i) => (
                            <Badge key={i} variant="secondary">{diag}</Badge>
                        ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold">Severity Assessment</h3>
                        <p className="flex items-center gap-2 pt-2">
                            <AlertTriangle className={
                                cn("h-5 w-5", {
                                    "text-green-500": result.severityAssessment.toLowerCase() === 'mild',
                                    "text-yellow-500": result.severityAssessment.toLowerCase() === 'moderate',
                                    "text-red-500": result.severityAssessment.toLowerCase() === 'severe',
                                })
                            } />
                            <span>{result.severityAssessment}</span>
                        </p>
                    </div>
                     <div>
                        <h3 className="font-semibold">Recommended Department</h3>
                        <p className="pt-2">{result.recommendedDepartment}</p>
                    </div>
                </div>
                <div>
                  <h3 className="font-semibold text-center">Chronic Disease Probability</h3>
                  <ChartContainer
                    config={{
                      probability: {
                        label: 'Chronic Probability',
                        color: 'hsl(var(--chart-3))',
                      },
                    }}
                    className="mx-auto aspect-square h-[160px]"
                  >
                    <RadialBarChart
                      data={[{ name: 'probability', value: result.chronicProbability * 100, fill: 'var(--color-probability)' }]}
                      startAngle={-90}
                      endAngle={270}
                      innerRadius="70%"
                      outerRadius="100%"
                      barSize={10}
                    >
                      <PolarGrid
                        gridType="circle"
                        radialLines={false}
                        stroke="none"
                        className="first:fill-muted last:fill-background"
                      />
                      <RadialBar dataKey="value" background cornerRadius={5} />
                       <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent 
                            hideLabel 
                            formatter={(value) => `${(Number(value)).toFixed(0)}% chance`}
                         />}
                        
                        />
                         <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-foreground text-2xl font-bold"
                        >
                            {(result.chronicProbability * 100).toFixed(0)}%
                        </text>
                    </RadialBarChart>
                  </ChartContainer>
                   <p className="text-center text-xs text-muted-foreground mt-2">
                    {result.chronicProbability > 0.7 ? 'High probability of being chronic.' :
                     result.chronicProbability > 0.4 ? 'Moderate probability of being chronic.' :
                     'Low probability of being chronic.'}
                   </p>
                </div>
              </div>
              {result.additionalRecommendations && (
                <div>
                  <h3 className="font-semibold">Additional Recommendations</h3>
                  <p className="text-sm text-muted-foreground pt-2">
                    {result.additionalRecommendations}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
            Disclaimer: This is an AI-generated assessment and not a substitute for professional medical advice.
        </CardFooter>
      </Card>
    </div>
  );
}
