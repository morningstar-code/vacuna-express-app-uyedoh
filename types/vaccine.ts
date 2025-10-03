
export interface VaccineDose {
  name: string;
  description?: string;
}

export interface Vaccine {
  id: string;
  name: string;
  category: 'Universal' | 'Niños' | 'Adolescentes' | 'Adultos';
  doses: VaccineDose[];
  ageGroup: string;
  description?: string;
  price?: number;
}

export interface CartItem {
  vaccineId: string;
  vaccineName: string;
  dose: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryDate?: string;
  trackingNumber?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  rnc: string;
  cedula: string;
  address: string;
  phone: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  invoiceNumber: string;
}
