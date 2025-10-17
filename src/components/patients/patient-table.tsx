'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Patient } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Badge } from '../ui/badge';
import { format, parseISO } from 'date-fns';

interface PatientTableProps {
  patients: Patient[];
}

export function PatientTable({ patients }: PatientTableProps) {
    const router = useRouter();

    const handleRowClick = (patientId: string) => {
        router.push(`/dashboard/patients/${patientId}`);
    }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Age</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>Conditions</TableHead>
          <TableHead className="text-right">Registered On</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id} onClick={() => handleRowClick(patient.id)} className="cursor-pointer">
            <TableCell className="font-medium">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                  <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {patient.name}
              </div>
            </TableCell>
            <TableCell>{patient.age}</TableCell>
            <TableCell>{patient.gender}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {patient.conditions.slice(0, 2).map((condition) => (
                  <Badge key={condition} variant="secondary">
                    {condition}
                  </Badge>
                ))}
                {patient.conditions.length > 2 && (
                    <Badge variant='outline'>+{patient.conditions.length-2} more</Badge>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">{format(parseISO(patient.registeredDate), 'MMMM d, yyyy')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
