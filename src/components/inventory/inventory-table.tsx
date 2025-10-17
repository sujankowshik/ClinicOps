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
    // Consider max stock to be roughly double the reorder level for visualization
    const maxStock = reorderLevel * 2;
    const percentage = (stock / maxStock) * 100;
    if (percentage < (item.reorderLevel / maxStock * 100)) return 'bg-destructive';
    if (percentage < ((item.reorderLevel * 1.5) / maxStock * 100)) return 'bg-yellow-500';
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
