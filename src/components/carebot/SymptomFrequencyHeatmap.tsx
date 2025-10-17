
'use client';

import { Surface, Symbols } from 'recharts';

const symptoms = [
  { name: 'Fever', frequency: 8, diseases: 6 },
  { name: 'Cough', frequency: 7, diseases: 5 },
  { name: 'Chest Pain', frequency: 5, diseases: 4 },
  { name: 'Rash', frequency: 4, diseases: 3 },
  { name: 'Abdominal Pain', frequency: 6, diseases: 3 },
];

export function SymptomFrequencyHeatmap() {
    const maxFreq = Math.max(...symptoms.map(s => s.frequency));

    const getColor = (frequency: number) => {
        const opacity = frequency / maxFreq;
        return `hsla(var(--primary-hsl), ${opacity})`.replace(')', ', 1)');
    };

  return (
    <div className="space-y-4">
      <p>The most frequently reported symptoms across current patient data are:</p>
      
      <div>
        <h4 className="text-sm font-semibold mb-2">Top 5 Symptoms Heatmap:</h4>
        <div className="flex flex-wrap gap-2">
            {symptoms.map(symptom => (
                <div 
                    key={symptom.name}
                    className="p-4 rounded-lg text-center"
                    style={{ 
                        backgroundColor: `hsl(var(--primary) / ${symptom.frequency / maxFreq})`,
                        color: `hsl(var(--primary-foreground))`
                    }}
                >
                    <div className="font-bold">{symptom.name}</div>
                    <div className="text-xs opacity-80">{symptom.frequency} cases</div>
                </div>
            ))}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        <strong>Fever</strong> appears in <strong>{symptoms.find(s => s.name === 'Fever')?.diseases}+ diseases</strong>, indicating a possible seasonal spike or outbreak.
      </p>
    </div>
  );
}
