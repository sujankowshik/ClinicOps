'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

const data = [
  { name: 'Malaria', cases: 8 },
  { name: 'COVID-19', cases: 12 },
  { name: 'Asthma', cases: 7 },
  { name: 'Pneumonia', cases: 9 },
  { name: 'Dengue', cases: 5 },
  { name: 'Tuberculosis', cases: 4 },
];

export function HighUrgencyDiseases() {
  return (
    <div className="space-y-4">
      <p>Here are the diseases currently classified as <strong>High Urgency</strong> based on medical records. These require quick attention due to potential complications.</p>
      
      <div className="h-[250px]">
        <h4 className="text-sm font-semibold mb-2">Bar Graph: High-Urgency Diseases</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Bar dataKey="cases" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-muted-foreground">
        <strong>Pulmonology</strong> and <strong>Infectious Diseases</strong> departments are under highest pressure.
      </p>

      <div className="flex justify-end">
        <Button size="sm" variant="outline">Would you like to notify more staff?</Button>
      </div>
    </div>
  );
}
