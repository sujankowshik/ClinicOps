'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { Appointment } from '@/lib/types';
import { eachDayOfInterval, format, subDays, parseISO } from 'date-fns';

const chartConfig = {
  scheduled: {
    label: 'Scheduled',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

interface AppointmentsChartProps {
  appointments: Appointment[];
}

export function AppointmentsChart({ appointments }: AppointmentsChartProps) {
  const chartData = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  }).map((day) => {
    const formattedDay = format(day, 'yyyy-MM-dd');
    return {
      date: format(day, 'MMM d'),
      scheduled: appointments.filter((a) => a.date === formattedDay).length,
    };
  });
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Appointments This Week</CardTitle>
        <CardDescription>
          Number of appointments scheduled per day.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
             />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              cursor={false}
            />
            <Bar dataKey="scheduled" fill="var(--color-scheduled)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
