import { patients } from '@/lib/data';
import { notFound } from 'next/navigation';
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
import { Calendar, User, Stethoscope } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = patients.find((p) => p.id === params.id);

  if (!patient) {
    notFound();
  }

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
          <CardContent className="text-sm">
             <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Registered: {format(parseISO(patient.registeredDate), 'MMMM d, yyyy')}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-lg">Active Conditions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {patient.conditions.map(condition => (
                        <Badge key={condition} variant="outline">{condition}</Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Visit History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.visits.map((visit) => (
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
