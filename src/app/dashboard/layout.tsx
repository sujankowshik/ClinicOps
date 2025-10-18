
'use client';

import { Header } from '@/components/layout/header';
import {
  patients as initialPatients,
  doctors as initialDoctors,
} from '@/lib/data';
import type { Patient, Doctor, Appointment, InventoryItem, Visit } from '@/lib/types';
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, errorEmitter } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { collection, addDoc, doc, setDoc, updateDoc, increment, query, where, getDocs, getDoc } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { format } from 'date-fns';
import { sendEmail } from '@/ai/flows/send-email-flow';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';

type DashboardContextType = {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[] | null;
  inventory: InventoryItem[] | null;
  addPatient: (patient: Omit<Patient, 'id' | 'avatarUrl' | 'registeredDate' | 'conditions' | 'visits' | 'medications'>) => void;
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
  const [visitsByPatient, setVisitsByPatient] = useState<Record<string, Visit[]>>({});
  const { toast } = useToast();
  
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const appointmentsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'appointments');
  }, [user, firestore]);
  const { data: appointments } = useCollection<Appointment>(appointmentsQuery);

  const inventoryQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'inventory_items');
  }, [user, firestore]);
  const { data: inventoryData } = useCollection<Omit<InventoryItem, 'status'>>(inventoryQuery);

  const fetchAllVisits = useCallback(async () => {
    if (!firestore || !user) return;

    const allVisits: Record<string, Visit[]> = {};
    for (const patient of initialPatients) {
        const visitsCollectionRef = collection(firestore, `patients/${patient.id}/visits`);
        try {
            const querySnapshot = await getDocs(visitsCollectionRef);
            const patientVisits = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Visit));
            
            // Add static visits if no dynamic visits are found
            if(patientVisits.length === 0) {
              allVisits[patient.id] = patient.visits;
            } else {
              allVisits[patient.id] = patientVisits;
            }
        } catch (error) {
            const contextualError = new FirestorePermissionError({
              operation: 'list',
              path: visitsCollectionRef.path,
            });
            console.error(`Could not fetch visits for patient ${patient.id}:`, contextualError);
            errorEmitter.emit('permission-error', contextualError);
            // Fallback to static data on error
            allVisits[patient.id] = patient.visits;
        }
    }
    setVisitsByPatient(allVisits);
  }, [firestore, user]);

  useEffect(() => {
    if (user) {
      fetchAllVisits();
    }
  }, [user, fetchAllVisits]);


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

  const addPatient = (newPatientData: Omit<Patient, 'id' | 'avatarUrl' | 'registeredDate' | 'conditions' | 'visits' | 'medications'>) => {
    const newPatient: Patient = {
        id: `p${patients.length + 1}`,
        ...newPatientData,
        avatarUrl: `https://picsum.photos/seed/patient${patients.length + 1}/100/100`,
        registeredDate: new Date().toISOString(),
        conditions: [],
        visits: [],
        medications: [],
    };
    setPatients(prevPatients => [newPatient, ...prevPatients]);
  };
  
  const addAppointment = (newAppointmentData: Omit<Appointment, 'id' | 'status' | 'time'>) => {
    if (!firestore) return;
    const appointmentsCollection = collection(firestore, 'appointments');
    const appointmentWithStatus = {
        ...newAppointmentData,
        status: 'Upcoming' as const,
        date: format(new Date(newAppointmentData.date), 'yyyy-MM-dd')
    }
    addDocumentNonBlocking(appointmentsCollection, appointmentWithStatus);
  }
  
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'status'>) => {
    if (!firestore) return;
    const inventoryCollection = collection(firestore, 'inventory_items');
    addDocumentNonBlocking(inventoryCollection, itemData);
  }

  const updateInventoryItemStock = async (itemId: string, quantityUsed: number) => {
    if (!firestore || !user?.email) return;

    const itemDocRef = doc(firestore, `inventory_items/${itemId}`);
    
    try {
        const itemSnapshot = await getDoc(itemDocRef);
        if (!itemSnapshot.exists()) {
            console.error("Item not found");
            return;
        }

        const itemData = itemSnapshot.data() as InventoryItem;
        const previousStock = itemData.stock;
        const newStock = previousStock - quantityUsed;

        updateDocumentNonBlocking(itemDocRef, {
            stock: increment(-quantityUsed)
        });

        if (newStock <= itemData.reorderLevel && previousStock > itemData.reorderLevel) {
            try {
                await sendEmail({
                    to: 'sujankowshik.xg.26@gmail.com',
                    subject: `Low Stock Alert: ${itemData.itemName}`,
                    body: `The stock for "${itemData.itemName}" is running low.\n\n` +
                          `Current Stock: ${newStock}\n` +
                          `Reorder Level: ${itemData.reorderLevel}\n\n` +
                          `Please reorder soon.`
                });
                toast({
                    title: 'Low Stock Notification Sent',
                    description: `An email has been sent to notify about low stock for ${itemData.itemName}.`
                });
            } catch (e) {
                console.error("Failed to send low stock email notification", e);
                toast({
                    variant: "destructive",
                    title: "Email Failed",
                    description: "Could not send low stock notification."
                });
            }
        }

    } catch (error) {
        console.error("Error getting document:", error);
    }
  }

  const addVisit = (visitData: Omit<Visit, 'id'>) => {
    if (!firestore) return;
    const visitsCollection = collection(firestore, `patients/${visitData.patientId}/visits`);
    addDocumentNonBlocking(visitsCollection, visitData).then(docRef => {
        if(docRef) {
          const newVisit = { id: docRef.id, ...visitData };
          setVisitsByPatient(prev => ({
              ...prev,
              [visitData.patientId]: [...(prev[visitData.patientId] || []), newVisit]
          }));
        }
    });
  };

  const getPatientVisits = (patientId: string) => {
    return visitsByPatient[patientId];
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
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex-grow p-4 lg:p-6">{children}</main>
      </div>
    </DashboardContext.Provider>
  );
}
