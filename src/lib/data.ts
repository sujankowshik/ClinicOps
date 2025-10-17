import type { Patient, Doctor, Appointment, InventoryItem } from './types';

export const patients: Patient[] = [
  {
    id: '1',
    name: 'Liam Johnson',
    age: 45,
    gender: 'Male',
    avatarUrl: 'https://picsum.photos/seed/patient1/100/100',
    registeredDate: '2022-08-15',
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    visits: [
      { id: 'v1', patientId: '1', date: '2023-01-20', doctor: 'Dr. Evelyn Reed', reason: 'Annual Checkup', notes: 'Patient is stable.' },
      { id: 'v2', patientId: '1', date: '2023-07-22', doctor: 'Dr. Evelyn Reed', reason: 'Follow-up', notes: 'Blood pressure is well-controlled.' },
    ],
  },
  {
    id: '2',
    name: 'Olivia Smith',
    age: 32,
    gender: 'Female',
    avatarUrl: 'https://picsum.photos/seed/patient2/100/100',
    registeredDate: '2021-03-10',
    conditions: ['Asthma'],
    visits: [
      { id: 'v3', patientId: '2', date: '2023-05-10', doctor: 'Dr. Ben Carter', reason: 'Asthma flare-up', notes: 'Prescribed new inhaler.' },
    ],
  },
  {
    id: '3',
    name: 'Noah Williams',
    age: 8,
    gender: 'Male',
    avatarUrl: 'https://picsum.photos/seed/patient3/100/100',
    registeredDate: '2023-01-05',
    conditions: ['Eczema'],
    visits: [
      { id: 'v4', patientId: '3', date: '2023-02-15', doctor: 'Dr. Isla Martinez', reason: 'Skin rash', notes: 'Topical cream prescribed.' },
    ],
  },
  {
    id: '4',
    name: 'Emma Brown',
    age: 68,
    gender: 'Female',
    avatarUrl: 'https://picsum.photos/seed/patient4/100/100',
    registeredDate: '2020-11-20',
    conditions: ['Osteoarthritis'],
    visits: [
      { id: 'v5', patientId: '4', date: '2023-09-01', doctor: 'Dr. Ben Carter', reason: 'Joint pain', notes: 'Physical therapy recommended.' },
    ],
  },
  {
    id: '5',
    name: 'Oliver Jones',
    age: 55,
    gender: 'Male',
    avatarUrl: 'https://picsum.photos/seed/patient5/100/100',
    registeredDate: '2019-06-30',
    conditions: ['High Cholesterol'],
    visits: [
      { id: 'v6', patientId: '5', date: '2023-04-12', doctor: 'Dr. Evelyn Reed', reason: 'Lipid panel review', notes: 'Dietary changes discussed.' },
    ],
  },
];

export const doctors: Doctor[] = [
  { id: '1', name: 'Dr. Evelyn Reed', email: 'evelyn.reed@clinic.com' },
  { id: '2', name: 'Dr. Ben Carter', email: 'ben.carter@clinic.com' },
  { id: '3', name: 'Dr. Isla Martinez', email: 'isla.martinez@clinic.com' },
];

// This appointment data is now legacy. It will be replaced by Firestore.
export const appointments: Appointment[] = [
  { id: '1', patientId: '1', patientName: 'Liam Johnson', doctorName: 'Dr. Evelyn Reed', date: new Date().toISOString().split('T')[0], status: 'Upcoming' },
  { id: '2', patientId: '2', patientName: 'Olivia Smith', doctorName: 'Dr. Ben Carter', date: new Date().toISOString().split('T')[0], status: 'Upcoming' },
  { id: '7', patientId: '2', patientName: 'Olivia Smith', doctorName: 'Dr. Evelyn Reed', date: new Date().toISOString().split('T')[0], status: 'Upcoming' },
  { id: '8', patientId: '3', patientName: 'Noah Williams', doctorName: 'Dr. Evelyn Reed', date: new Date().toISOString().split('T')[0], status: 'Upcoming' },
  { id: '3', patientId: '3', patientName: 'Noah Williams', doctorName: 'Dr. Isla Martinez', date: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0], status: 'Upcoming' },
  { id: '4', patientId: '4', patientName: 'Emma Brown', doctorName: 'Dr. Ben Carter', date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0], status: 'Completed' },
  { id: '5', patientId: '5', patientName: 'Oliver Jones', doctorName: 'Dr. Evelyn Reed', date: new Date(new Date().setDate(new Date().getDate() - 14)).toISOString().split('T')[0], status: 'Completed' },
  { id: '6', patientId: '1', patientName: 'Liam Johnson', doctorName: 'Dr. Evelyn Reed', date: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString().split('T')[0], status: 'Cancelled' },
];

// This inventory data is now legacy. It will be replaced by Firestore.
export const inventory: InventoryItem[] = [
    { id: 'inv1', itemName: 'Sterile Gauze Pads (Box of 100)', stock: 50, reorderLevel: 20, supplier: 'MediSupply Co.', lastReorderDate: '2023-10-01', status: 'In Stock' },
    { id: 'inv2', itemName: 'Ibuprofen (500mg, Bottle of 500)', stock: 15, reorderLevel: 10, supplier: 'PharmaDirect', lastReorderDate: '2023-09-15', status: 'Low Stock' },
    { id: 'inv3', itemName: 'Disposable Syringes (10ml, Box of 100)', stock: 8, reorderLevel: 15, supplier: 'MediSupply Co.', lastReorderDate: '2023-11-05', status: 'Reorder Now' },
    { id: 'inv4', itemName: 'Latex Gloves (Medium, Box of 100)', stock: 120, reorderLevel: 50, supplier: 'Global Health', lastReorderDate: '2023-10-20', status: 'In Stock' },
    { id: 'inv5', itemName: 'Antiseptic Wipes (Box of 200)', stock: 45, reorderLevel: 40, supplier: 'PharmaDirect', lastReorderDate: '2023-11-10', status: 'Low Stock' },
    { id: 'inv6', itemName: 'Digital Thermometers', stock: 25, reorderLevel: 10, supplier: 'Global Health', lastReorderDate: '2023-08-30', status: 'In Stock' },
];
