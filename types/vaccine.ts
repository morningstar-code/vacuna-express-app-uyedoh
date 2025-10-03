
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

export interface Promotion {
  id: string;
  title: string;
  description: string;
  type: 'seasonal' | 'loyalty' | 'family' | 'corporate';
  discountType: 'percentage' | 'fixed' | 'points';
  discountValue: number;
  validFrom: string;
  validTo: string;
  applicableVaccines?: string[];
  minQuantity?: number;
  isActive: boolean;
}

export interface LoyaltyProgram {
  userId: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  ordersCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'reminder' | 'promotion' | 'shipment' | 'educational';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  scheduledFor?: string;
  relatedVaccineId?: string;
  relatedOrderId?: string;
}

export interface EducationalContent {
  id: string;
  title: string;
  type: 'article' | 'video' | 'infographic';
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime?: number;
}

export interface Appointment {
  id: string;
  userId: string;
  type: 'clinic' | 'home';
  vaccineIds: string[];
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  location?: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  notes?: string;
}

export interface InventoryItem {
  vaccineId: string;
  stockLevel: number;
  lowStockThreshold: number;
  isAvailable: boolean;
  estimatedRestockDate?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'digital_wallet';
  provider: 'banco_popular' | 'santa_cruz' | 'promerica' | 'paypal' | 'stripe';
  name: string;
  isDefault: boolean;
  currency: 'DOP' | 'USD';
}

export interface Subscription {
  id: string;
  userId: string;
  type: 'monthly' | 'yearly';
  plan: 'basic' | 'premium' | 'corporate';
  vaccineIds: string[];
  price: number;
  currency: 'DOP' | 'USD';
  status: 'active' | 'paused' | 'cancelled';
  nextBillingDate: string;
  autoRenew: boolean;
}

export interface VaccinationRecord {
  id: string;
  userId: string;
  vaccineId: string;
  dose: string;
  administeredDate: string;
  nextDueDate?: string;
  certificateUrl?: string;
  providerId?: string;
  batchNumber?: string;
  notes?: string;
}

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  birthDate: string;
  gender: 'male' | 'female' | 'other';
  vaccinationRecords: VaccinationRecord[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  requirement: string;
  points: number;
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  earnedAt: string;
}
