
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { duration: '1–3 days', cases: 6, note: 'Flu, Food Poisoning, etc.' },
  { duration: '4–6 days', cases: 5, note: '' },
  { duration: '7–10 days', cases: 9, note: 'Chronic & severe' },
];

export function DiseaseDurationHistogram() {
  return (
    <div className="space-y-4">
      <p>The average duration of reported diseases is approximately <strong>6.2 days</strong>, indicating mostly short- to medium-term conditions.</p>
      
      <div className="h-[250px]">
        <h4 className="text-sm font-semibold mb-2">Histogram: Disease Durations (Days)</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="duration" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
              formatter={(value, name, props) => [`${value} cases`, props.payload.note]}
              labelFormatter={(label) => `Duration: ${label}`}
            />
            <Bar dataKey="cases" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-muted-foreground">
        Chronic diseases usually show durations ≥10 days.
      </p>
    </div>
  );
}
