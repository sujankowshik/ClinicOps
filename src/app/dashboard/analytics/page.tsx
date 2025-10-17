'use client';

import { StatsCards } from '@/components/analytics/stats-cards';
import { AttendanceChart } from '@/components/analytics/attendance-chart';
import { useDashboard } from '../layout';
import { Loader2 } from 'lucide-react';

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
        <AttendanceChart appointments={appointments} />
      </div>
    </div>
  );
}
