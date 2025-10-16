'use client';

import { useState } from 'react';
import { PatientTable } from '@/components/patients/patient-table';
import { NewPatientDialog } from '@/components/patients/new-patient-dialog';
import { patients as initialPatients } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Patient } from '@/lib/types';

export default function PatientsPage() {
    const [patients, setPatients] = useState<Patient[]>(initialPatients);

    const handleAddPatient = (newPatientData: Omit<Patient, 'id' | 'avatarUrl' | 'registeredDate' | 'conditions' | 'visits'>) => {
        const newPatient: Patient = {
            id: (patients.length + 1).toString(),
            ...newPatientData,
            avatarUrl: `https://picsum.photos/seed/patient${patients.length + 1}/100/100`,
            registeredDate: new Date().toISOString(),
            conditions: [],
            visits: [],
        };
        setPatients(prevPatients => [newPatient, ...prevPatients]);
    }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-headline">Patient Management</CardTitle>
            <CardDescription>View, manage, and register new patients.</CardDescription>
          </div>
          <NewPatientDialog onAddPatient={handleAddPatient} />
        </div>
      </CardHeader>
      <CardContent>
        <PatientTable patients={patients} />
      </CardContent>
    </Card>
  );
}
