export type Patient = {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  avatarUrl: string;
  registeredDate: string;
  conditions: string[];
  visits: Visit[];
};

export type Visit = {
  id: string;
  date: string;
  doctor: string;
  reason: string;
  notes: string;
};

export type Doctor = {
  id: string;
  name: string;
};

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time?: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
};

export type InventoryItem = {
  id: string;
  itemName: string;
  stock: number;
  reorderLevel: number;
  supplier: string;
  lastReorderDate: string;
  status: 'In Stock' | 'Low Stock' | 'Reorder Now';
};
