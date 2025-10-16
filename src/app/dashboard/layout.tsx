'use client';

import { Header } from '@/components/layout/header';
import {
  patients as initialPatients,
  doctors as initialDoctors,
} from '@/lib/data';
import type { Patient, Doctor, Appointment, InventoryItem, Visit } from '@/lib/types';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { collection, addDoc, doc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { format } from 'date-fns';
import { AppSidebar } from '@/components/layout/app-sidebar';

type DashboardContextType = {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[] | null;
  inventory: InventoryItem[] | null;
  addPatient: (patient: Omit<Patient, 'id' | 'avatarUrl' | 'registeredDate' | 'conditions' | 'visits'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'time'>) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'status'>) => void;
  updateInventoryItemStock: (itemId: string, quantityUsed: number) => void;
  addVisit: (visit: Omit<Visit, 'id'>) => void;
  getPatientVisits: (patientId: string) => Visit[] | undefined;
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
  
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const appointmentsQuery = useMemoFirebase(() => collection(firestore, 'appointments'), [firestore]);
  const { data: appointments } = useCollection<Appointment>(appointmentsQuery);

  const inventoryQuery = useMemoFirebase(() => collection(firestore, 'inventory_items'), [firestore]);
  const { data: inventoryData } = useCollection<Omit<InventoryItem, 'status'>>(inventoryQuery);

  const inventory = useMemo(() => {
    if (!inventoryData) return null;
    return inventoryData.map(item => {
      let status: 'In Stock' | 'Low Stock' | 'Reorder Now';
      if (item.stock <= 0) {
        status = 'Reorder Now';
      } else if (item.stock <= item.reorderLevel) {
        status = 'Low Stock';
      } else {
        status = 'In Stock';
      }
      return { ...item, status };
    });
  }, [inventoryData]);

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
    const appointmentsCollection = collection(firestore, 'appointments');
    const appointmentWithStatus = {
        ...newAppointmentData,
        status: 'Upcoming' as const,
        date: format(new Date(newAppointmentData.date), 'yyyy-MM-dd')
    }
    addDocumentNonBlocking(appointmentsCollection, appointmentWithStatus);
  }
  
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'status'>) => {
    const inventoryCollection = collection(firestore, 'inventory_items');
    addDocumentNonBlocking(inventoryCollection, itemData);
  }

  const updateInventoryItemStock = (itemId: string, quantityUsed: number) => {
    const itemDocRef = doc(firestore, `inventory_items/${itemId}`);
    updateDocumentNonBlocking(itemDocRef, {
      stock: increment(-quantityUsed)
    });
  }

  const addVisit = (visitData: Omit<Visit, 'id'>) => {
    const visitsCollection = collection(firestore, `patients/${visitData.patientId}/visits`);
    addDocumentNonBlocking(visitsCollection, visitData);
  };

  const getPatientVisits = (patientId: string) => {
    // This function is no longer responsible for fetching all visits.
    // It's kept for context, but data is now fetched directly in the component.
    return undefined;
  };

  const contextValue = {
    patients,
    doctors,
    appointments,
    inventory,
    addPatient,
    addAppointment,
    addInventoryItem,
    updateInventoryItemStock,
    addVisit,
    getPatientVisits,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-grow p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
