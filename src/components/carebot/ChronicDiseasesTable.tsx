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

const chronicDiseases = [
  { disease: 'Asthma', department: 'Pulmonology', doctor: 'Dr. Farhan', medication: 'Inhalers, Steroids' },
  { disease: 'Migraine', department: 'Neurology', doctor: 'Dr. Anjali', medication: 'Painkillers' },
  { disease: 'IBS', department: 'Gastroenterology', doctor: 'Dr. Singh', medication: 'Antispasmodics' },
  { disease: 'Anemia', department: 'Hematology', doctor: 'Dr. Neha', medication: 'Iron supplements' },
  { disease: 'Depression', department: 'Psychiatry', doctor: 'Dr. Iqbal', medication: 'Antidepressants' },
  { disease: 'Arthritis', department: 'Rheumatology', doctor: 'Dr. Neha', medication: 'Anti-inflammatories' },
];

export function ChronicDiseasesTable() {
  return (
    <div className="space-y-4">
      <p>The following diseases are marked as chronic and typically require consistent monitoring, medication, and follow-up care.</p>
      
      <div>
        <h4 className="text-sm font-semibold mb-2">Chronic Diseases Table:</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Disease</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Medication</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chronicDiseases.map((item) => (
              <TableRow key={item.disease}>
                <TableCell className="font-medium">{item.disease}</TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell>{item.doctor}</TableCell>
                <TableCell>{item.medication}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <p className="text-sm text-muted-foreground">You can view a chronic case trend chart for the last 30 days.</p>
    </div>
  );
}
