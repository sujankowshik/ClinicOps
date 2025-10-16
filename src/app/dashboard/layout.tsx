'use client';

import { Header } from '@/components/layout/header';
import {
  patients as initialPatients,
  doctors as initialDoctors,
  appointments as initialAppointments,
} from '@/lib/data';
import type { Patient, Doctor, Appointment } from '@/lib/types';
import { createContext, useContext, useState } from 'react';

type DashboardContextType = {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  addPatient: (patient: Omit<Patient, 'id' | 'avatarUrl' | 'registeredDate' | 'conditions' | 'visits'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
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
  
  const addAppointment = (newAppointmentData: Omit<Appointment, 'id' | 'status'>) => {
    const newAppointment: Appointment = {
      id: `app${appointments.length + 1}`,
      ...newAppointmentData,
      status: 'Upcoming',
    };
    setAppointments(prevAppointments => [newAppointment, ...prevAppointments]);
  }

  return (
    <DashboardContext.Provider value={{ patients, doctors, appointments, addPatient, addAppointment }}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow p-4 lg:p-6">{children}</main>
      </div>
    </DashboardContext.Provider>
  );
}
