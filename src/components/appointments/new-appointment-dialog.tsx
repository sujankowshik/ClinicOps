'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Patient, Doctor, Appointment } from '@/lib/types';
import { Calendar as CalendarIcon, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { sendEmail } from '@/ai/flows/send-email-flow';

const appointmentFormSchema = z.object({
  patientName: z.string().min(2, 'Patient name is required.'),
  doctorId: z.string().min(1, 'Doctor is required.'),
  date: z.date({ required_error: 'A date is required.' }),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface NewAppointmentDialogProps {
  patients: Patient[];
  doctors: Doctor[];
  onAddAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'time'>) => void;
}

export function NewAppointmentDialog({
  patients,
  doctors,
  onAddAppointment,
}: NewAppointmentDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientName: '',
      doctorId: '',
    },
  });

  async function onSubmit(data: AppointmentFormValues) {
    const doctor = doctors.find(d => d.id === data.doctorId);

    if (!doctor) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Invalid doctor selected."
        })
        return;
    }

    const newAppointmentData = {
        // A patientId would be looked up in a real app
        patientId: `new-${Date.now()}`,
        patientName: data.patientName,
        doctorName: doctor.name,
        date: format(data.date, 'yyyy-MM-dd'),
    };

    onAddAppointment(newAppointmentData);

    toast({
      title: 'Appointment Scheduled!',
      description: 'The new appointment has been added to the calendar.',
    });

    if (doctor.email) {
      try {
          await sendEmail({
              to: 'sujankowshik.xg.26@gmail.com',
              subject: 'New Appointment Scheduled',
              body: `Hello ${doctor.name},\n\nA new appointment has been scheduled with ${data.patientName} on ${format(data.date, 'PPP')}.`,
          });
          toast({
              title: 'Notification Sent',
              description: `An email has been sent to ${doctor.name}.`,
          });
      } catch(e) {
          console.error("Failed to send email notification", e);
          toast({
              variant: "destructive",
              title: "Email Failed",
              description: "Could not send appointment notification."
          })
      }
    } else {
        console.warn(`Doctor ${doctor.name} has no email address. Skipping notification.`);
    }

    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Schedule New Appointment</DialogTitle>
          <DialogDescription>
            Enter patient's name, and select a doctor and date for the new appointment.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="patientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter patient's full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Doctor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a doctor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {doctors.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <DialogFooter>
              <Button type="submit">Schedule</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
