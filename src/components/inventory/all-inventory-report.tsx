'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { InventoryItem } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface AllInventoryReportProps {
  inventory: InventoryItem[] | null;
}

export function AllInventoryReport({ inventory }: AllInventoryReportProps) {
  const getStatusVariant = (status: InventoryItem['status']) => {
    if (status === 'Reorder Now') return 'destructive';
    if (status === 'Low Stock') return 'default';
    return 'secondary';
  };

  const getProgressColor = (item: InventoryItem) => {
    if (item.status === 'Reorder Now') return 'bg-destructive';
    if (item.status === 'Low Stock') return 'bg-yellow-500';
    return 'bg-primary';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Full Inventory List</CardTitle>
        <CardDescription>
          A complete overview of all items in your inventory.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {inventory ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Item Name</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Supplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.itemName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(item.stock / (item.reorderLevel * 2)) * 100}
                        className="h-2 w-20"
                        indicatorClassName={getProgressColor(item)}
                      />
                      <span>
                        {item.stock} / {item.reorderLevel * 2}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.supplier}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex h-[300px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Loading inventory...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
