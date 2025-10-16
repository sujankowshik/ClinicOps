'use client';

import { StatsCards } from '@/components/analytics/stats-cards';
import { AttendanceChart } from '@/components/analytics/attendance-chart';
import { useDashboard } from '../layout';

export default function AnalyticsPage() {
  const { appointments, patients } = useDashboard();

  if (!appointments || !patients) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <StatsCards appointments={appointments} patients={patients} />
      <div className="grid gap-6">
        <AttendanceChart appointments={appointments} />
      </div>
    </div>
  );
}
