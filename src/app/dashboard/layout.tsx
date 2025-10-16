'use client';

import { Header } from '@/components/layout/header';
import {
  patients as initialPatients,
  doctors as initialDoctors,
  appointments as initialAppointments,
} from '@/lib/data';
import type { Patient, Doctor, Appointment } from '@/lib/types';
import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type DashboardContextType = {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  addPatient: (patient: Omit<Patient, 'id' | 'avatarUrl' | 'registeredDate' | 'conditions' | 'visits'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'time'>) => void;
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [doctors] = useState<Doctor[]>(initialDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  const addPatient = (newPatientData: Omit<Patient, 'id' | 'avatarUrl' | 'registeredDate' | 'conditions' | 'visits'>) => {
    const newPatient: Patient = {
        id: `p${patients.length + 1}`,
        ...newPatientData,
        avatarUrl: `https://picsum.photos/seed/patient${patients.length + 1}/100/100`,
        registeredDate: new Date().toISOString(),
        conditions: [],
        visits: [],
    };
    setPatients(prevPatients => [newPatient, ...prevPatients]);
  };
  
  const addAppointment = (newAppointmentData: Omit<Appointment, 'id' | 'status' | 'time'>) => {
    const newAppointment: Appointment = {
      id: `app${appointments.length + 1}`,
      ...newAppointmentData,
      status: 'Upcoming',
      time: 'All day',
    };
    setAppointments(prevAppointments => [newAppointment, ...prevAppointments]);
  }

  const contextValue = {
    patients,
    doctors,
    appointments,
    addPatient,
    addAppointment,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow p-4 lg:p-6">{children}</main>
      </div>
    </DashboardContext.Provider>
  );
}
