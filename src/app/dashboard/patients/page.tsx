'use client';

import { PatientTable } from '@/components/patients/patient-table';
import { NewPatientDialog } from '@/components/patients/new-patient-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '../layout';

export default function PatientsPage() {
    const { patients, addPatient } = useDashboard();

    if (!patients) {
      return <div>Loading...</div>
    }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-headline">Patient Management</CardTitle>
            <CardDescription>View, manage, and register new patients.</CardDescription>
          </div>
          <NewPatientDialog onAddPatient={addPatient} />
        </div>
      </CardHeader>
      <CardContent>
        <PatientTable patients={patients} />
      </CardContent>
    </Card>
  );
}
