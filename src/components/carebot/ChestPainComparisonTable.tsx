
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const diseases = [
  { disease: 'Heart Attack', urgency: 'Critical', chronic: 'No', doctor: 'Dr. Kavita' },
  { disease: 'GERD', urgency: 'Medium', chronic: 'Yes', doctor: 'Dr. Singh' },
  { disease: 'Asthma', urgency: 'High', chronic: 'Yes', doctor: 'Dr. Farhan' },
  { disease: 'Pneumonia', urgency: 'High', chronic: 'No', doctor: 'Dr. Farhan' },
];

export function ChestPainComparisonTable() {
  const getUrgencyVariant = (urgency: string) => {
    switch(urgency) {
        case 'Critical': return 'destructive';
        case 'High': return 'default';
        default: return 'secondary';
    }
  }
  
  return (
    <div className="space-y-4">
      <p>Chest pain can indicate several conditions. Here's a comparison by urgency level:</p>
      
      <div>
        <h4 className="text-sm font-semibold mb-2">Table: Chest Pain Related Diseases</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Disease</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Chronic</TableHead>
              <TableHead>Doctor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diseases.map((item) => (
              <TableRow key={item.disease}>
                <TableCell className="font-medium">{item.disease}</TableCell>
                <TableCell>
                    <Badge variant={getUrgencyVariant(item.urgency)}>{item.urgency}</Badge>
                </TableCell>
                <TableCell>{item.chronic}</TableCell>
                <TableCell>{item.doctor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <p className="text-sm text-destructive font-semibold">
        Recommendation: If pain is sudden or severe, consult Cardiology immediately.
      </p>
    </div>
  );
}
