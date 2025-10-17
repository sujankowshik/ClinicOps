'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { InventoryItem } from '@/lib/types';
import { Download } from 'lucide-react';
import { format } from 'date-fns';

const chartConfig = {
  stock: {
    label: 'Current Stock',
    color: 'hsl(var(--chart-2))',
  },
  reorderLevel: {
    label: 'Reorder Level',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

interface LowStockReportProps {
  inventory: InventoryItem[];
}

export function LowStockReport({ inventory }: LowStockReportProps) {
  const lowStockItems = inventory.filter(
    (item) => item.status === 'Low Stock' || item.status === 'Reorder Now'
  );

  const handleDownload = () => {
    const headers = 'Item Name,Current Stock,Reorder Level,Supplier,Status\n';
    const csvContent = lowStockItems
      .map((d) => `${d.itemName},${d.stock},${d.reorderLevel},${d.supplier},${d.status}`)
      .join('\n');
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `low_stock_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
    const getStatusColor = (status: 'In Stock' | 'Low Stock' | 'Reorder Now') => {
    switch (status) {
      case 'In Stock':
        return 'secondary';
      case 'Low Stock':
        return 'outline';
      case 'Reorder Now':
        return 'destructive';
      default:
        return 'default';
    }
  };


  return (
    <div className="space-y-4">
        {lowStockItems.length > 0 ? (
            <>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart data={lowStockItems} accessibilityLayer margin={{ right: 20 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                    dataKey="itemName"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 10) + '...'}
                    />
                    <YAxis allowDecimals={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="stock" fill="var(--color-stock)" radius={4} />
                    <Bar dataKey="reorderLevel" fill="var(--color-reorderLevel)" radius={4} />
                </BarChart>
            </ChartContainer>

            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Reorder At</TableHead>
                    <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {lowStockItems.map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.itemName}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>{item.reorderLevel}</TableCell>
                        <TableCell>
                        <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className='flex justify-end'>
                <Button size="sm" variant="outline" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                </Button>
            </div>
            </>
        ) : (
            <div className="flex h-[300px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed">
                <p className="text-muted-foreground">No items are low on stock.</p>
            </div>
        )}
    </div>
  );
}
