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
  patientId: string;
  date: string;
  doctor: string;
  reason: string;
  notes: string;
  summary?: string;
};

export type Doctor = {
  id: string;
  name: string;
  email: string;
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
  lastReorderDate?: string; // Made optional as it might not exist for new items
  status: 'In Stock' | 'Low Stock' | 'Reorder Now';
};
