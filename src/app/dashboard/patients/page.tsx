import { PatientTable } from '@/components/patients/patient-table';
import { NewPatientDialog } from '@/components/patients/new-patient-dialog';
import { patients } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PatientsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-headline">Patient Management</CardTitle>
            <CardDescription>View, manage, and register new patients.</CardDescription>
          </div>
          <NewPatientDialog />
        </div>
      </CardHeader>
      <CardContent>
        <PatientTable patients={patients} />
      </CardContent>
    </Card>
  );
}
