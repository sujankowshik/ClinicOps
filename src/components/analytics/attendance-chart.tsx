'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { Appointment } from '@/lib/types';
import { format, parseISO } from 'date-fns';

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
  const monthlyData: { [key: string]: { appointments: number } } = {};

  appointments.forEach((appt) => {
    const month = format(parseISO(appt.date), 'MMM yyyy');
    if (!monthlyData[month]) {
      monthlyData[month] = { appointments: 0 };
    }
    monthlyData[month].appointments++;
  });

  const chartData = Object.keys(monthlyData).map(key => ({
    month: key,
    ...monthlyData[key]
  })).slice(-6); // show last 6 months


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Appointments Over Time</CardTitle>
        <CardDescription>
          Total number of scheduled appointments per month.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
             <YAxis
              allowDecimals={false}
             />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              type="monotone"
              dataKey="appointments"
              stroke="var(--color-appointments)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
