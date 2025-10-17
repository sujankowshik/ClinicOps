'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { Appointment } from '@/lib/types';
import { format, parseISO, isToday } from 'date-fns';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';

const chartConfig = {
  appointments: {
    label: 'Appointments',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface AttendanceChartProps {
  appointments: Appointment[];
}

export function AttendanceChart({ appointments }: AttendanceChartProps) {
  
  const todaysAppointments = appointments.filter(appt => isToday(parseISO(appt.date)));

  const appointmentsByDoctor: { [key: string]: { appointments: number } } = {};

  todaysAppointments.forEach((appt) => {
    const doctor = appt.doctorName;
    if (!appointmentsByDoctor[doctor]) {
        appointmentsByDoctor[doctor] = { appointments: 0 };
    }
    appointmentsByDoctor[doctor].appointments++;
  });

  const chartData = Object.keys(appointmentsByDoctor).map(key => ({
    doctor: key,
    ...appointmentsByDoctor[key]
  }));
  
  const handleDownload = () => {
    const headers = "Doctor,Appointments\n";
    const csvContent = chartData.map(d => `${d.doctor},${d.appointments}`).join('\n');
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
        URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `todays_appointments_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Today's Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="doctor"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.replace('Dr. ', '')}
            />
             <YAxis
              allowDecimals={false}
             />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="appointments"
              fill="var(--color-appointments)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
        </Button>
      </CardFooter>
    </Card>
  );
}
