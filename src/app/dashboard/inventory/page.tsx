import { inventory } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InventoryStatusChart } from '@/components/inventory/inventory-status-chart';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { NewInventoryItemDialog } from '@/components/inventory/new-inventory-item-dialog';

export default function InventoryPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Inventory Management
          </h1>
          <NewInventoryItemDialog />
        </div>
        
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline">Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <InventoryStatusChart inventory={inventory} />
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle className="font-headline">Stock Details</CardTitle>
            </CardHeader>
            <CardContent>
                <InventoryTable inventory={inventory} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
