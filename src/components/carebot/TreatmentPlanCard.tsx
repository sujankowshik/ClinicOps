
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function TreatmentPlanCard() {
  return (
    <div className="space-y-4">
      <p>Dengue treatment involves supportive care. No specific antiviral exists, but monitoring is crucial.</p>
      
      <Card className="bg-secondary/50">
        <CardHeader>
            <CardTitle>Treatment Overview Card: Dengue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Doctor:</strong> Dr. Rao</p>
          <p><strong>Department:</strong> Infectious Diseases</p>
          <p><strong>Symptoms:</strong> Fever, Joint Pain, Rash</p>
          <p><strong>Medication:</strong> Fluids, Platelet Management</p>
          <p><strong>Urgency:</strong> <span className="font-semibold text-red-500">High</span></p>
          <p><strong>Inventory Needed:</strong> Platelet Packs</p>
          <p><strong>Current stock:</strong> <span className="text-green-500">Available</span></p>
        </CardContent>
      </Card>
      
      <p className="text-sm text-muted-foreground">
        Next checkup recommended in <strong>48 hours</strong>.
      </p>

       <div className="flex justify-end">
        <Button size="sm">Would you like me to book it?</Button>
      </div>
    </div>
  );
}
