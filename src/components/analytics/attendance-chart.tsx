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
import { appointments } from '@/lib/data';
import { format, parseISO } from 'date-fns';

const monthlyData: { [key: string]: { completed: number; cancelled: number } } = {};

appointments.forEach((appt) => {
  const month = format(parseISO(appt.date), 'MMM yyyy');
  if (!monthlyData[month]) {
    monthlyData[month] = { completed: 0, cancelled: 0 };
  }
  if (appt.status === 'Completed') {
    monthlyData[month].completed++;
  } else if (appt.status === 'Cancelled') {
    monthlyData[month].cancelled++;
  }
});

const chartData = Object.keys(monthlyData).map(key => ({
  month: key,
  ...monthlyData[key]
})).slice(-6); // show last 6 months

const chartConfig = {
  completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-1))',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

export function AttendanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Patient Attendance</CardTitle>
        <CardDescription>
          Completed vs. Cancelled appointments over time.
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
              dataKey="completed"
              stroke="var(--color-completed)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="cancelled"
              stroke="var(--color-cancelled)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
