
import { Vaccine } from '@/types/vaccine';

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
