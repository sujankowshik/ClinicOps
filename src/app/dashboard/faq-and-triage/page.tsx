
'use client';

import { useState, useRef, ComponentType } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { faqAndTriageAssistant } from '@/ai/flows/faq-and-triage-assistant';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Send, User, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { HighUrgencyDiseases } from '@/components/carebot/HighUrgencyDiseases';
import { ChronicDiseasesTable } from '@/components/carebot/ChronicDiseasesTable';
import { DoctorAvailability } from '@/components/carebot/DoctorAvailability';
import { DoctorCasesPieChart } from '@/components/carebot/DoctorCasesPieChart';
import { InventoryCheckBarChart } from '@/components/carebot/InventoryCheckBarChart';
import { SymptomFrequencyHeatmap } from '@/components/carebot/SymptomFrequencyHeatmap';
import { ChestPainComparisonTable } from '@/components/carebot/ChestPainComparisonTable';
import { DiseaseDurationHistogram } from '@/components/carebot/DiseaseDurationHistogram';
import { DepartmentPatientLoad } from '@/components/carebot/DepartmentPatientLoad';
import { TreatmentPlanCard } from '@/components/carebot/TreatmentPlanCard';

const formSchema = z.object({
  query: z.string().min(1, 'Please enter a question.'),
});

type FormValues = z.infer<typeof formSchema>;

type Message = {
  role: 'user' | 'assistant';
  content: string | ComponentType;
  isComplex?: boolean;
  triageInstructions?: string;
  props?: Record<string, any>;
};

const predefinedQuestions: { [key: string]: ComponentType } = {
    'q1': HighUrgencyDiseases,
    'q2': ChronicDiseasesTable,
    'q3': DoctorAvailability,
    'q4': DoctorCasesPieChart,
    'q5': InventoryCheckBarChart,
    'q6': SymptomFrequencyHeatmap,
    'q7': ChestPainComparisonTable,
    'q8': DiseaseDurationHistogram,
    'q9': DepartmentPatientLoad,
    'q10': TreatmentPlanCard,
};

const questionMap: { [key: string]: string[] } = {
    'q1': ['high urgency'],
    'q2': ['chronic', 'long-term care'],
    'q3': ['abdominal pain', 'nausea', 'available'],
    'q4': ['dr. farhan', 'diseases treated'],
    'q5': ['antimalarial', 'inventory'],
    'q6': ['symptoms', 'frequently'],
    'q7': ['chest pain', 'severe'],
    'q8': ['average disease duration'],
    'q9': ['department', 'most patients'],
    'q10': ['treatment plan', 'dengue'],
};

const findQuestionKey = (query: string): string | null => {
    const lowerCaseQuery = query.toLowerCase();
    for(const key in questionMap) {
        if(questionMap[key].every(keyword => lowerCaseQuery.includes(keyword))) {
            return key;
        }
    }
    return null;
}

export default function CareBotPage() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: '' },
  });

  const handleAiResponse = async (query: string) => {
    setLoading(true);
    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    const questionKey = findQuestionKey(query);

    if (questionKey && predefinedQuestions[questionKey]) {
        const CannedResponseComponent = predefinedQuestions[questionKey];
        const assistantMessage: Message = {
            role: 'assistant',
            content: CannedResponseComponent,
            props: {}
        };
        setMessages((prev) => [...prev, assistantMessage]);
    } else {
        try {
            const response = await faqAndTriageAssistant({ query });
            const assistantMessage: Message = {
                role: 'assistant',
                content: response.answer,
                isComplex: response.isComplex,
                triageInstructions: response.triageInstructions,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (e) {
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
            };
            setMessages((prev) => [...prev, errorMessage]);
            console.error(e);
        }
    }


    setLoading(false);
  };

  const onSubmit = (data: FormValues) => {
    handleAiResponse(data.query);
  };

  return (
    <Card className="h-[calc(100vh-10rem)] flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline">CareBot</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' && 'justify-end'
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-prose rounded-lg p-3',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                    {typeof message.content === 'string' ? (
                        <p className="text-sm">{message.content}</p>
                    ) : (
                        <message.content {...message.props} />
                    )}

                  {message.isComplex && (
                    <div className="mt-2 border-t border-border/50 pt-2">
                        <p className="text-xs font-semibold">This seems complex. Here's the next step:</p>
                        <p className="text-xs text-muted-foreground">{message.triageInstructions}</p>
                    </div>
                  )}
                </div>
                 {message.role === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {loading && (
                 <div className='flex items-start gap-3'>
                    <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                     <div className="max-w-md rounded-lg p-3 bg-muted">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                 </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full items-start gap-2"
          >
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input placeholder="Ask a question..." {...field} disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
