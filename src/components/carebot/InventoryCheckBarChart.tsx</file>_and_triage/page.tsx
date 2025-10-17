
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Antimalarial Drugs', level: 70 },
  { name: 'IV Fluids', level: 50 },
  { name: 'Oxygen Cylinders', level: 20 },
];

export function InventoryCheckBarChart() {
  return (
    <div className="space-y-4">
      <p>You are asking about the availability of antimalarial drugs required for treating Malaria, which has a <strong>high urgency</strong> level.</p>
      
      <div className="h-[200px]">
        <h4 className="text-sm font-semibold mb-2">Inventory Check (Bar Graph):</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} unit="%" fontSize={12} />
            <YAxis dataKey="name" type="category" fontSize={12} width={120} tickLine={false} axisLine={false} />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
              formatter={(value) => `${value}% full`}
            />
            <Bar dataKey="level" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.level <= 20 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className="text-sm text-yellow-500 font-semibold">