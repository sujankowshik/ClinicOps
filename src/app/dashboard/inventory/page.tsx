'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InventoryStatusChart } from '@/components/inventory/inventory-status-chart';
import { NewInventoryItemDialog } from '@/components/inventory/new-inventory-item-dialog';
import { useDashboard } from '../layout';
import { Loader2 } from 'lucide-react';
import { LogUsageDialog } from '@/components/inventory/log-usage-dialog';
import { LowStockReport } from '@/components/inventory/low-stock-report';
import { AllInventoryReport } from '@/components/inventory/all-inventory-report';

export default function InventoryPage() {
  const { inventory, addInventoryItem, updateInventoryItemStock } = useDashboard();

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Inventory Management
          </h1>
          <div className="flex gap-2">
            {inventory && <LogUsageDialog inventory={inventory} onUpdateStock={updateInventoryItemStock} />}
            <NewInventoryItemDialog onAddItem={addInventoryItem} />
          </div>
        </div>
        
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            {inventory ? (
                <InventoryStatusChart inventory={inventory} />
            ) : (
                <div className="flex justify-center items-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="font-headline">Low Stock Report</CardTitle>
            </CardHeader>
            <CardContent>
                 {inventory ? (
                    <LowStockReport inventory={inventory} />
                 ) : (
                    <div className="flex justify-center items-center h-[300px]">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                 )}
            </CardContent>
        </Card>
      </div>
      <AllInventoryReport inventory={inventory} />
    </div>
  );
}
