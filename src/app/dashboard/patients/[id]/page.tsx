
'use client';

import { patients } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Stethoscope, Loader2, History, UserCheck, Pill } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useDashboard } from '../../layout';
import type { Visit } from '@/lib/types';
import { VisitSummary } from '@/components/patients/visit-summary';
import { useEffect, useState } from 'react';

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addVisit, getPatientVisits } = useDashboard();
  const [visits, setVisits] = useState<Visit[] | undefined>([]);
  const [visitsLoading, setVisitsLoading] = useState(true);

  const patient = patients.find((p) => p.id === id);

  useEffect(() => {
    if (patient) {
      setVisitsLoading(true);
      const patientVisits = getPatientVisits(patient.id);
      setVisits(patientVisits);
      setVisitsLoading(false);
    }
  }, [id, patient, getPatientVisits]);


  if (!patient) {
    notFound();
  }
  
  const lastVisit = visits && visits.length > 0
    ? visits.reduce((latest, visit) => new Date(visit.date) > new Date(latest.date) ? visit : latest)
    : null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={patient.avatarUrl} alt={patient.name} />
              <AvatarFallback className="text-3xl">{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline text-2xl">{patient.name}</CardTitle>
            <CardDescription>{patient.age} years old, {patient.gender}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
             <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Registered: {format(parseISO(patient.registeredDate), 'MMMM d, yyyy')}</span>
            </div>
            {lastVisit && (
                 <div className="flex items-center gap-3">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <span>Last Visit: {format(parseISO(lastVisit.date), 'MMMM d, yyyy')}</span>
                </div>
            )}
             {lastVisit && (
                 <div className="flex items-center gap-3">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                    <span>Treated by: {lastVisit.doctor}</span>
                </div>
            )}
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg">Medical History</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {patient.conditions.map(condition => (
                        <Badge key={condition} variant="outline">{condition}</Badge>
                    ))}
                     {patient.conditions.length === 0 && <p className="text-sm text-muted-foreground">No conditions recorded.</p>}
                </div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    Current Medications
                </CardTitle>
            </CardHeader>
            <CardContent>
                {patient.medications && patient.medications.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                        {patient.medications.map(med => (
                            <li key={med.name} className="flex justify-between">
                                <span className="font-medium">{med.name}</span>
                                <span className="text-muted-foreground">{med.dosage}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">No medications prescribed.</p>
                )}
            </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <VisitSummary patient={patient} onAddVisit={addVisit} />
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Visit History</CardTitle>
          </CardHeader>
          <CardContent>
            {visitsLoading ? (
                <div className="flex justify-center items-center h-24">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits && visits.length > 0 ? (
                  visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>{format(parseISO(visit.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                        {visit.doctor}
                      </div>
                    </TableCell>
                    <TableCell>{visit.reason}</TableCell>
                  </TableRow>
                ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center h-24">No visit history.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
