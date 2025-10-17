'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

const data = [
  { name: 'Pulmonology', patients: 4 },
  { name: 'Infectious Dis.', patients: 3 },
  { name: 'General Med.', patients: 3 },
  { name: 'Gastroent.', patients: 2 },
  { name: 'Others', patients: 1 },
];

export function DepartmentPatientLoad() {
  return (
    <div className="space-y-4">
      <p>Here’s the breakdown of patient load by department.</p>
      
      <div className="h-[250px]">
        <h4 className="text-sm font-semibold mb-2">Bar Chart: Department-wise Patient Load</h4>
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
            <Bar dataKey="patients" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-destructive font-semibold">
        Pulmonology is under pressure — consider reallocating staff.
      </p>
    </div>
  );
}
