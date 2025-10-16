import { AppointmentList } from '@/components/appointments/appointment-list';
import { NewAppointmentDialog } from '@/components/appointments/new-appointment-dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { appointments, patients, doctors } from '@/lib/data';
import { isFuture, isPast, parseISO } from 'date-fns';

export default function AppointmentsPage() {
  const upcomingAppointments = appointments.filter((a) => isFuture(parseISO(a.date)) || a.date === new Date().toISOString().split('T')[0]);
  const pastAppointments = appointments.filter((a) => isPast(parseISO(a.date)) && a.date !== new Date().toISOString().split('T')[0]);

  return (
    <Tabs defaultValue="upcoming" className="space-y-4">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <NewAppointmentDialog patients={patients} doctors={doctors} />
      </div>
      <TabsContent value="upcoming">
        <AppointmentList appointments={upcomingAppointments} />
      </TabsContent>
      <TabsContent value="past">
        <AppointmentList appointments={pastAppointments} />
      </TabsContent>
    </Tabs>
  );
}
