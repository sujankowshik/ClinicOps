'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const availability = [
  { condition: 'Appendicitis', department: 'General Surgery', doctor: 'Dr. Nidhi', urgency: 'Critical' },
  { condition: 'IBS', department: 'Gastroenterology', doctor: 'Dr. Singh', urgency: 'Medium' },
  { condition: 'Food Poisoning', department: 'General Medicine', doctor: 'Dr. Mehul', urgency: 'Medium' },
];

export function DoctorAvailability() {
  return (
    <div className="space-y-4">
      <p>Based on your symptoms (Abdominal pain, Nausea), potential conditions are: Appendicitis, IBS, or Food Poisoning.</p>
      
      <div>
        <h4 className="text-sm font-semibold mb-2">Available Doctors & Departments:</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Condition</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Urgency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availability.map((item) => (
              <TableRow key={item.condition}>
                <TableCell className="font-medium">{item.condition}</TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell>{item.doctor}</TableCell>
                <TableCell>
                    <Badge variant={item.urgency === 'Critical' ? 'destructive' : 'secondary'}>{item.urgency}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Dr. Nidhi has an available slot at <strong>3:30 PM today</strong>.
      </p>

      <div className="flex justify-end">
        <Button size="sm" variant="default">Would you like to book an appointment?</Button>
      </div>
    </div>
  );
}
