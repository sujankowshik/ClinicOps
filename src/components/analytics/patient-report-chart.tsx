'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
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
import type { Patient } from '@/lib/types';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import { format } from 'date-fns';

const chartConfig = {
  patients: {
    label: 'Patients',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

interface PatientReportChartProps {
  patients: Patient[];
}

export function PatientReportChart({ patients }: PatientReportChartProps) {
  
  const ageGroups = {
    '0-17': 0,
    '18-40': 0,
    '41-65': 0,
    '65+': 0,
  };

  patients.forEach(patient => {
    if (patient.age <= 17) {
        ageGroups['0-17']++;
    } else if (patient.age <= 40) {
        ageGroups['18-40']++;
    } else if (patient.age <= 65) {
        ageGroups['41-65']++;
    } else {
        ageGroups['65+']++;
    }
  });

  const chartData = Object.keys(ageGroups).map(group => ({
    ageGroup: group,
    patients: ageGroups[group as keyof typeof ageGroups],
  }));

  const handleDownload = () => {
    const headers = "Age Group,Number of Patients\n";
    const csvContent = chartData.map(d => `${d.ageGroup},${d.patients}`).join('\n');
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `patient_demographics_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Patient Demographics</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="ageGroup"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="patients"
              fill="var(--color-patients)"
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
