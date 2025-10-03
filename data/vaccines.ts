
import { 
  Vaccine, 
  Promotion, 
  EducationalContent, 
  InventoryItem, 
  Badge,
  Notification 
} from '@/types/vaccine';

export const vaccines: Vaccine[] = [
  // Universal
  {
    id: 'hep-b',
    name: 'Hepatitis B',
    category: 'Universal',
    doses: [
      { name: '1ª Dosis' },
      { name: '2ª Dosis' },
      { name: '3ª Dosis' },
      { name: 'Refuerzo' }
    ],
    ageGroup: 'Cualquier edad',
    price: 45.00
  },
  {
    id: 'vrs',
    name: 'Virus Respiratorio Sincitial',
    category: 'Universal',
    doses: [
      { name: 'Dosis Única' }
    ],
    ageGroup: 'Lactantes y Adultos 60+',
    price: 85.00
  },
  
  // Niños
  {
    id: 'dpt',
    name: 'DPT',
    category: 'Niños',
    doses: [
      { name: '1ª Dosis' },
      { name: '2ª Dosis' },
      { name: '3ª Dosis' },
      { name: 'Refuerzo' }
    ],
    ageGroup: 'Niños pequeños',
    price: 35.00
  },
  {
    id: 'neumococo-13',
    name: 'Neumococo 13',
    category: 'Niños',
    doses: [
      { name: '1ª Dosis' },
      { name: '2ª Dosis' },
      { name: '3ª Dosis' },
      { name: 'Refuerzo' }
    ],
    ageGroup: 'Niños pequeños',
    price: 75.00
  },
  {
    id: 'influenza',
    name: 'Influenza',
    category: 'Niños',
    doses: [
      { name: '1ª Dosis' },
      { name: 'Refuerzo' }
    ],
    ageGroup: 'Anual desde 6 meses',
    price: 25.00
  },
  {
    id: 'hexavalente',
    name: 'Hexavalente',
    category: 'Niños',
    doses: [
      { name: '1ª Dosis' },
      { name: '2ª Dosis' },
      { name: '3ª Dosis' },
      { name: 'Refuerzo' }
    ],
    ageGroup: '2, 4, 6 meses',
    price: 95.00
  },
  {
    id: 'srp',
    name: 'SRP (Sarampión, Rubéola, Paperas)',
    category: 'Niños',
    doses: [
      { name: '1ª Dosis' },
      { name: 'Refuerzo' }
    ],
    ageGroup: '11-12 meses',
    price: 55.00
  },
  {
    id: 'varicela',
    name: 'Varicela',
    category: 'Niños',
    doses: [
      { name: '1ª Dosis' },
      { name: '2ª Dosis' }
    ],
    ageGroup: '12-15 meses',
    price: 65.00
  },
  {
    id: 'hepatitis-a',
    name: 'Hepatitis A',
    category: 'Niños',
    doses: [
      { name: '1ª Dosis' },
      { name: '2ª Dosis' }
    ],
    ageGroup: '12-23 meses',
    price: 50.00
  },
  {
    id: 'pentavalente',
    name: 'Pentavalente',
    category: 'Niños',
    doses: [
      { name: '1ª Dosis' },
      { name: '2ª Dosis' },
      { name: '3ª Dosis' },
      { name: 'Refuerzo' }
    ],
    ageGroup: '2, 4, 6 meses',
    price: 85.00
  },
  {
    id: 'rotavirus',
    name: 'Rotavirus',
    category: 'Niños',
    doses: [
      { name: '2ª Dosis' },
      { name: '3ª Dosis' }
    ],
    ageGroup: 'Lactantes',
    price: 70.00
  },

  // Adolescentes
  {
    id: 'meningococo',
    name: 'Meningococo',
    category: 'Adolescentes',
    doses: [
      { name: '1ª Dosis' },
      { name: '2ª Dosis' }
    ],
    ageGroup: '11-18 años',
    price: 120.00
  },
  {
    id: 'vph',
    name: 'VPH',
    category: 'Adolescentes',
    doses: [
      { name: '1ª Dosis' },
      { name: '2ª Dosis' },
      { name: '3ª Dosis' }
    ],
    ageGroup: '9-45 años',
    price: 180.00
  },
  {
    id: 'tdap',
    name: 'Tdap',
    category: 'Adolescentes',
    doses: [
      { name: '1ª Dosis' },
      { name: 'Refuerzo' }
    ],
    ageGroup: 'Adolescentes y adultos',
    price: 45.00
  },

  // Adultos
  {
    id: 'neumococo-20',
    name: 'Neumococo 20',
    category: 'Adultos',
    doses: [
      { name: '1ª Dosis' },
      { name: '2ª Dosis' },
      { name: '3ª Dosis' },
      { name: 'Refuerzo' }
    ],
    ageGroup: 'Adultos mayores',
    price: 95.00
  },
  {
    id: 'pneumococo-23',
    name: 'Pneumococo 23',
    category: 'Adultos',
    doses: [
      { name: 'Dosis Única' },
      { name: 'Refuerzo' }
    ],
    ageGroup: '65+ y grupos de riesgo',
    price: 85.00
  },
  {
    id: 'td',
    name: 'Td',
    category: 'Adultos',
    doses: [
      { name: 'Refuerzo' }
    ],
    ageGroup: 'Adultos cada 10 años',
    price: 35.00
  },
  {
    id: 'herpes-zoster',
    name: 'Herpes Zoster',
    category: 'Adultos',
    doses: [
      { name: '1ª Dosis' },
      { name: '2ª Dosis' }
    ],
    ageGroup: '50+ años',
    price: 220.00
  },
  {
    id: 'anti-d',
    name: 'Anti D',
    category: 'Adultos',
    doses: [
      { name: 'Según indicación' }
    ],
    ageGroup: 'Embarazadas Rh-',
    price: 150.00
  }
];

export const getVaccinesByCategory = (category: string) => {
  return vaccines.filter(vaccine => vaccine.category === category);
};

export const getVaccineById = (id: string) => {
  return vaccines.find(vaccine => vaccine.id === id);
};

// Promotions Data
export const promotions: Promotion[] = [
  {
    id: 'flu-winter-2024',
    title: 'Campaña de Influenza Invierno',
    description: '20% de descuento en vacunas de influenza durante la temporada de invierno',
    type: 'seasonal',
    discountType: 'percentage',
    discountValue: 20,
    validFrom: '2024-12-01',
    validTo: '2024-03-31',
    applicableVaccines: ['influenza'],
    isActive: true,
  },
  {
    id: 'vph-awareness-2024',
    title: 'Mes de Concientización VPH',
    description: 'Descuento especial en vacunas VPH durante el mes de concientización',
    type: 'seasonal',
    discountType: 'percentage',
    discountValue: 15,
    validFrom: '2024-01-01',
    validTo: '2024-01-31',
    applicableVaccines: ['vph'],
    isActive: true,
  },
  {
    id: 'family-package',
    title: 'Paquete Familiar',
    description: 'Descuento del 25% al comprar 3 o más vacunas para la familia',
    type: 'family',
    discountType: 'percentage',
    discountValue: 25,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    minQuantity: 3,
    isActive: true,
  },
  {
    id: 'corporate-bulk',
    title: 'Descuento Corporativo',
    description: 'Descuento del 30% para pedidos corporativos de 10+ vacunas',
    type: 'corporate',
    discountType: 'percentage',
    discountValue: 30,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    minQuantity: 10,
    isActive: true,
  },
];

// Educational Content Data
export const educationalContent: EducationalContent[] = [
  {
    id: 'flu-benefits',
    title: 'Beneficios de la Vacuna contra la Influenza',
    type: 'article',
    content: 'La vacuna contra la influenza es una de las medidas más efectivas para prevenir la gripe estacional. Protege contra las cepas más comunes del virus y reduce significativamente el riesgo de hospitalización.',
    category: 'Prevención',
    tags: ['influenza', 'prevención', 'salud'],
    publishedAt: '2024-01-15',
    readTime: 5,
  },
  {
    id: 'vph-importance',
    title: 'Importancia de la Vacuna VPH',
    type: 'article',
    content: 'La vacuna contra el Virus del Papiloma Humano (VPH) previene varios tipos de cáncer, incluyendo cáncer cervical, anal y de garganta. Es más efectiva cuando se administra antes del inicio de la actividad sexual.',
    category: 'Prevención del Cáncer',
    tags: ['vph', 'cáncer', 'prevención'],
    publishedAt: '2024-01-10',
    readTime: 7,
  },
  {
    id: 'child-vaccination-schedule',
    title: 'Calendario de Vacunación Infantil',
    type: 'infographic',
    content: 'Guía completa del calendario de vacunación recomendado para niños desde el nacimiento hasta los 18 años.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800',
    category: 'Pediatría',
    tags: ['niños', 'calendario', 'vacunación'],
    publishedAt: '2024-01-05',
    readTime: 3,
  },
  {
    id: 'meningitis-outbreak-prevention',
    title: 'Prevención de Brotes de Meningitis',
    type: 'video',
    content: 'Video educativo sobre cómo prevenir brotes de meningitis en comunidades y la importancia de la vacunación.',
    videoUrl: 'https://example.com/meningitis-video',
    category: 'Salud Pública',
    tags: ['meningitis', 'brotes', 'prevención'],
    publishedAt: '2024-01-12',
    readTime: 10,
  },
];

// Inventory Data
export const inventory: InventoryItem[] = vaccines.map(vaccine => ({
  vaccineId: vaccine.id,
  stockLevel: Math.floor(Math.random() * 100) + 10,
  lowStockThreshold: 20,
  isAvailable: true,
  estimatedRestockDate: Math.random() > 0.8 ? '2024-02-15' : undefined,
}));

// Badges Data
export const badges: Badge[] = [
  {
    id: 'first-order',
    name: 'Primera Compra',
    description: 'Realizaste tu primera orden en VacunaExpress',
    iconName: 'star.fill',
    requirement: 'Completar primera orden',
    points: 100,
  },
  {
    id: 'family-protector',
    name: 'Protector Familiar',
    description: 'Vacunaste a 3 o más miembros de tu familia',
    iconName: 'house.fill',
    requirement: 'Vacunar 3+ miembros familiares',
    points: 250,
  },
  {
    id: 'prevention-champion',
    name: 'Campeón de Prevención',
    description: 'Mantuviste al día todas las vacunas recomendadas',
    iconName: 'shield.fill',
    requirement: 'Completar calendario de vacunación',
    points: 500,
  },
  {
    id: 'loyal-customer',
    name: 'Cliente Leal',
    description: 'Realizaste 10 o más pedidos',
    iconName: 'heart.fill',
    requirement: 'Completar 10+ pedidos',
    points: 300,
  },
  {
    id: 'referral-master',
    name: 'Maestro de Referencias',
    description: 'Referiste a 5 nuevos usuarios',
    iconName: 'person.2.fill',
    requirement: 'Referir 5+ usuarios',
    points: 400,
  },
];

// Sample Notifications
export const sampleNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'reminder',
    title: 'Recordatorio de Refuerzo',
    message: 'Es hora de tu refuerzo de Tdap. ¡No olvides programar tu cita!',
    isRead: false,
    createdAt: '2024-01-20T10:00:00Z',
    scheduledFor: '2024-01-25T09:00:00Z',
    relatedVaccineId: 'tdap',
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'promotion',
    title: '¡Oferta Especial!',
    message: '20% de descuento en vacunas de influenza. Válido hasta fin de mes.',
    isRead: false,
    createdAt: '2024-01-18T14:30:00Z',
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    type: 'shipment',
    title: 'Pedido en Camino',
    message: 'Tu pedido #12345 está en camino. Llegará mañana entre 9-11 AM.',
    isRead: true,
    createdAt: '2024-01-17T16:45:00Z',
    relatedOrderId: 'order-12345',
  },
];

// Helper functions
export const getActivePromotions = () => {
  const now = new Date();
  return promotions.filter(promo => {
    const validFrom = new Date(promo.validFrom);
    const validTo = new Date(promo.validTo);
    return promo.isActive && now >= validFrom && now <= validTo;
  });
};

export const getPromotionForVaccine = (vaccineId: string) => {
  return promotions.find(promo => 
    promo.isActive && 
    (!promo.applicableVaccines || promo.applicableVaccines.includes(vaccineId))
  );
};

export const getInventoryForVaccine = (vaccineId: string) => {
  return inventory.find(item => item.vaccineId === vaccineId);
};

export const getEducationalContentByCategory = (category: string) => {
  return educationalContent.filter(content => content.category === category);
};
