'use client';

import { StatsCards } from '@/components/analytics/stats-cards';
import { AppointmentsChart } from '@/components/analytics/appointments-chart';
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
      <div className="grid gap-6 md:grid-cols-2">
        <AppointmentsChart appointments={appointments} />
        <AttendanceChart appointments={appointments} />
      </div>
    </div>
  );
}
