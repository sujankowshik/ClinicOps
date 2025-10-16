import { inventory } from '@/lib/data';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function InventoryPage() {
  const getStatusColor = (status: 'In Stock' | 'Low Stock' | 'Reorder Now') => {
    switch (status) {
      case 'In Stock':
        return 'secondary';
      case 'Low Stock':
        return 'outline'; // often yellow/orange in themes
      case 'Reorder Now':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getProgressColor = (stock: number, reorderLevel: number) => {
    const percentage = (stock / (reorderLevel * 2)) * 100;
    if (percentage < (reorderLevel / (reorderLevel * 2)) * 100) return 'bg-destructive';
    if (percentage < ((reorderLevel + (reorderLevel * 0.5)) / (reorderLevel * 2)) * 100) return 'bg-yellow-500';
    return 'bg-primary';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Inventory Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Item Name</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Last Reorder</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.itemName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={(item.stock / (item.reorderLevel * 2)) * 100} className="h-2 w-24" indicatorClassName={getProgressColor(item.stock, item.reorderLevel)} />
                    <span>{item.stock}</span>
                    <span className="text-muted-foreground">/ {item.reorderLevel*2}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
                </TableCell>
                <TableCell>{item.supplier}</TableCell>
                <TableCell className="text-right">{item.lastReorderDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
