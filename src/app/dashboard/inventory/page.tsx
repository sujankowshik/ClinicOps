'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InventoryStatusChart } from '@/components/inventory/inventory-status-chart';
import { InventoryTable } from '@/components/inventory/inventory-table';
import { NewInventoryItemDialog } from '@/components/inventory/new-inventory-item-dialog';
import { useDashboard } from '../layout';
import { Loader2 } from 'lucide-react';

export default function InventoryPage() {
  const { inventory, addInventoryItem } = useDashboard();

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Inventory Management
          </h1>
          <NewInventoryItemDialog onAddItem={addInventoryItem} />
        </div>
        
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="font-headline">Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            {inventory ? (
                <InventoryStatusChart inventory={inventory} />
            ) : (
                <div className="flex justify-center items-center h-[250px]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )}
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle className="font-headline">Stock Details</CardTitle>
            </CardHeader>
            <CardContent>
                 {inventory ? (
                    <InventoryTable inventory={inventory} />
                 ) : (
                    <div className="flex justify-center items-center h-[250px]">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                 )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
