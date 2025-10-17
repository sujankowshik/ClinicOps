'use client';

import { StatsCards } from '@/components/analytics/stats-cards';
import { AttendanceChart } from '@/components/analytics/attendance-chart';
import { useDashboard } from '../layout';
import { Loader2 } from 'lucide-react';
import { LowStockReport } from '@/components/inventory/low-stock-report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsPage() {
  const { appointments, patients, inventory } = useDashboard();

  if (!appointments || !patients || !inventory) {
    return (
        <div className="flex justify-center items-center h-full">
            <Loader2 className="h-12 w-12 animate-spin" />
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatsCards appointments={appointments} patients={patients} inventory={inventory} />
      <div className="grid gap-6 md:grid-cols-2">
        <AttendanceChart appointments={appointments} />
        <Card>
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
    </div>
  );
}
