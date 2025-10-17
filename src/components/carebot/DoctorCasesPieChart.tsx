'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'COVID-19', value: 30 },
  { name: 'Asthma', value: 25 },
  { name: 'Pneumonia', value: 20 },
  { name: 'Tuberculosis', value: 25 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const inventory = [
    'Oxygen cylinders, PPE Kits',
    'Inhalers, Steroids',
    'TB Drugs',
];

export function DoctorCasesPieChart() {
  return (
    <div className="space-y-4">
      <p>Dr. Farhan (Pulmonology) is currently handling the following conditions:</p>
      
      <div className="h-[200px]">
        <h4 className="text-sm font-semibold mb-2">Pie Chart: Cases handled by Dr. Farhan</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Inventory Used:</h4>
        <ul className="list-disc list-inside text-sm text-muted-foreground">
            {inventory.map(item => <li key={item}>{item}</li>)}
        </ul>
      </div>

      <p className="text-sm font-semibold text-destructive">
        Resource demand is high in Pulmonology. Consider checking stock levels.
      </p>
    </div>
  );
}
