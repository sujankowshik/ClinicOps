import { StatsCards } from '@/components/analytics/stats-cards';
import { AppointmentsChart } from '@/components/analytics/appointments-chart';
import { AttendanceChart } from '@/components/analytics/attendance-chart';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <StatsCards />
      <div className="grid gap-6 md:grid-cols-2">
        <AppointmentsChart />
        <AttendanceChart />
      </div>
    </div>
  );
}
