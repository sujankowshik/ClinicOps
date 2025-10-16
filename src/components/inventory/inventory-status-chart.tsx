'use client';

import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { InventoryItem } from '@/lib/types';

interface InventoryStatusChartProps {
  inventory: InventoryItem[];
}

const chartConfig = {
  inStock: {
    label: 'In Stock',
    color: 'hsl(var(--chart-1))',
  },
  lowStock: {
    label: 'Low Stock',
    color: 'hsl(var(--chart-4))',
  },
  reorderNow: {
    label: 'Reorder Now',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

export function InventoryStatusChart({ inventory }: InventoryStatusChartProps) {
  const data = [
    { name: 'In Stock', value: inventory.filter((i) => i.status === 'In Stock').length, fill: 'var(--color-inStock)' },
    { name: 'Low Stock', value: inventory.filter((i) => i.status === 'Low Stock').length, fill: 'var(--color-lowStock)' },
    { name: 'Reorder Now', value: inventory.filter((i) => i.status === 'Reorder Now').length, fill: 'var(--color-reorderNow)' },
  ];

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[250px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-mt-4"
        />
      </PieChart>
    </ChartContainer>
  );
}
