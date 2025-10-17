'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  type ChartConfig,
} from '@/components/ui/chart';
import type { Appointment, InventoryItem } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';

const chartConfig = {
  value: {
    label: 'Count',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

interface SummaryChartProps {
  appointments: Appointment[];
  inventory: InventoryItem[];
}

export function SummaryChart({ appointments, inventory }: SummaryChartProps) {
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const todaysAppointments = appointments.filter(
    (a) => a.date === today && a.status === 'Upcoming'
  ).length;

  const lowStockItems = inventory.filter(
    (i) => i.status === 'Low Stock' || i.status === 'Reorder Now'
  ).length;

  const chartData = [
    { metric: "Today's Appts", value: todaysAppointments },
    { metric: 'Low Stock', value: lowStockItems },
    { metric: 'Total Appts', value: appointments.length },
  ];

  const handleDownload = () => {
    const headers = "Metric,Value\n";
    const csvContent = chartData.map(d => `${d.metric},${d.value}`).join('\n');
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
        URL.revokeObjectURL(link.href);
    }
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `clinic_summary_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Operational Summary</CardTitle>
        <CardDescription>
          A quick overview of key metrics for today.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={chartData} accessibilityLayer layout="vertical">
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="metric"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={80}
            />
            <XAxis type="number" hide />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {payload[0].payload.metric}
                          </span>
                          <span className="font-bold text-foreground">
                            {payload[0].value}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="value" fill="var(--color-value)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
         <div className="flex items-center gap-2 font-medium leading-none">
            Summary for {format(new Date(), 'MMMM d, yyyy')}
          </div>
          <div className="flex items-center gap-2 leading-none text-muted-foreground">
            This data can be downloaded for reporting purposes.
          </div>
          <Button size="sm" variant="outline" className='mt-2' onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Summary
          </Button>
      </CardFooter>
    </Card>
  );
}
