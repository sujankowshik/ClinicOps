'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BarChart, Users, CalendarCheck, PackageX } from 'lucide-react';
import type { Appointment, Patient, InventoryItem } from '@/lib/types';
import { format } from 'date-fns';

interface StatsCardsProps {
  appointments: Appointment[];
  patients: Patient[];
  inventory: InventoryItem[];
}

export function StatsCards({ appointments, patients, inventory }: StatsCardsProps) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todaysAppointments = appointments.filter(
    (a) => a.date === today && a.status === 'Upcoming'
  ).length;
  const lowStockItems = inventory.filter(
    (i) => i.status === 'Low Stock' || i.status === 'Reorder Now'
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{patients.length}</div>
          <p className="text-xs text-muted-foreground">
            +2 since last month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Today's Appointments
          </CardTitle>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todaysAppointments}</div>
          <p className="text-xs text-muted-foreground">
            Scheduled for today
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          <PackageX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowStockItems}</div>
          <p className="text-xs text-muted-foreground">
            Items needing attention
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Appointments
          </CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{appointments.length}</div>
          <p className="text-xs text-muted-foreground">
            +10 from last week
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
