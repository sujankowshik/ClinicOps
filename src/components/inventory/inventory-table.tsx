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

interface InventoryTableProps {
  inventory: InventoryItem[];
}

export function InventoryTable({ inventory }: InventoryTableProps) {
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

  const getProgressColor = (stock: number, reorderLevel: number) => {
    if (reorderLevel <= 0) return 'bg-primary'; // Avoid division by zero
    const percentage = (stock / (reorderLevel * 2)) * 100;
    if (percentage < 25) return 'bg-destructive';
    if (percentage < 50) return 'bg-yellow-500';
    return 'bg-primary';
  };

  return (
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
                <Progress value={(item.stock / (item.reorderLevel * 2)) * 100} className="h-2 w-20" indicatorClassName={getProgressColor(item.stock, item.reorderLevel)} />
                <span>{item.stock}</span>
                <span className="text-muted-foreground">/ {item.reorderLevel*2}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
            </TableCell>
            <TableCell>{item.supplier}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
