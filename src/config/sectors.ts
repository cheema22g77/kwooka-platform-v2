/**
 * Consolidated Sector Configuration
 * Single source of truth for all sector-related data
 */

export const SECTORS = {
  ndis: {
    id: 'ndis',
    name: 'NDIS',
    fullName: 'NDIS Practice Standards',
    authority: 'NDIS Quality and Safeguards Commission',
    icon: 'Shield',
    color: 'orange',
    description: 'National Disability Insurance Scheme provider compliance',
    keyAreas: [
      'Rights and Responsibilities',
      'Governance and Operational Management',
      'Provision of Supports',
      'Support Provision Environment',
      'Worker Screening',
      'Incident Management',
      'Complaints Management',
      'Restrictive Practices',
    ],
    regulations: [
      'NDIS Act 2013',
      'NDIS Practice Standards',
      'NDIS Code of Conduct',
      'NDIS Quality and Safeguards Framework',
      'Worker Screening Requirements',
    ],
    authorities: ['NDIS Quality and Safeguards Commission', 'NDIA'],
    keyRequirements: [
      'Registration and certification requirements',
      'Worker screening (NDIS Worker Check)',
      'Incident management and reportable incidents',
      'Complaints management',
      'Support delivery standards',
      'Restrictive practices authorisation',
    ],
  },
  transport: {
    id: 'transport',
    name: 'Transport',
    fullName: 'Heavy Vehicle National Law (HVNL)',
    authority: 'National Heavy Vehicle Regulator (NHVR)',
    icon: 'Truck',
    color: 'blue',
    description: 'Heavy vehicle and transport logistics compliance',
    keyAreas: [
      'Chain of Responsibility',
      'Fatigue Management',
      'Speed Compliance',
      'Mass & Loading',
      'Vehicle Standards',
      'Driver Competency',
      'Journey Management',
      'Record Keeping',
    ],
    regulations: [
      'Heavy Vehicle National Law (HVNL)',
      'Chain of Responsibility (CoR)',
      'Fatigue Management Standards',
      'Work Diary Requirements',
      'Mass, Dimension and Loading Requirements',
      'National Heavy Vehicle Accreditation Scheme (NHVAS)',
    ],
    authorities: ['National Heavy Vehicle Regulator (NHVR)', 'Main Roads WA', 'Transport WA'],
    keyRequirements: [
      'Driver fatigue management and work diaries',
      'Vehicle maintenance and safety inspections',
      'Load restraint and mass management',
      'Speed compliance and journey management',
      'Chain of responsibility obligations',
      'Accreditation maintenance (NHVAS, TruckSafe)',
    ],
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare',
    fullName: 'National Safety and Quality Health Service Standards',
    authority: 'Australian Commission on Safety and Quality in Health Care',
    icon: 'Heart',
    color: 'red',
    description: 'Healthcare and clinical governance compliance',
    keyAreas: [
      'Clinical Governance',
      'Partnering with Consumers',
      'Infection Prevention',
      'Medication Safety',
      'Patient Identification',
      'Clinical Handover',
      'Blood Management',
      'Recognising Deterioration',
    ],
    regulations: [
      'Health Practitioner Regulation National Law',
      'Australian Health Service Safety and Quality Standards',
      'Private Health Facilities Act',
      'Medicines and Poisons Act',
    ],
    authorities: [
      'AHPRA',
      'Australian Commission on Safety and Quality in Health Care',
      'WA Department of Health',
    ],
    keyRequirements: [
      'Practitioner registration and credentials',
      'Clinical governance frameworks',
      'Infection control and sterilisation',
      'Medication management',
      'Patient safety and incident reporting',
    ],
  },
  aged_care: {
    id: 'aged_care',
    name: 'Aged Care',
    fullName: 'Aged Care Quality Standards',
    authority: 'Aged Care Quality and Safety Commission',
    icon: 'Home',
    color: 'purple',
    description: 'Aged care facility and service compliance',
    keyAreas: [
      'Consumer Dignity and Choice',
      'Ongoing Assessment and Planning',
      'Personal Care and Clinical Care',
      'Services and Supports',
      'Organisation Service Environment',
      'Feedback and Complaints',
      'Human Resources',
      'Organisational Governance',
    ],
    regulations: [
      'Aged Care Act 1997',
      'Aged Care Quality Standards',
      'Serious Incident Response Scheme (SIRS)',
    ],
    authorities: ['Aged Care Quality and Safety Commission', 'Department of Health and Aged Care'],
    keyRequirements: [
      'Quality standards compliance (8 standards)',
      'Serious incident reporting (SIRS)',
      'Clinical care requirements',
      'Staffing requirements and care minutes',
    ],
  },
  workplace: {
    id: 'workplace',
    name: 'Workplace Safety',
    fullName: 'Work Health and Safety Act & Regulations',
    authority: 'WorkSafe / SafeWork Australia',
    icon: 'Briefcase',
    color: 'green',
    description: 'Workplace health and safety compliance',
    keyAreas: [
      'PCBU Duties',
      'Risk Management',
      'Consultation',
      'Training & Competency',
      'Incident Notification',
      'Hazardous Work',
      'Emergency Procedures',
      'Worker Health Monitoring',
    ],
    regulations: [
      'Work Health and Safety Act 2020 (WA)',
      'WHS Regulations',
      'Codes of Practice',
      'Fair Work Act',
    ],
    authorities: ['WorkSafe WA', 'Fair Work Commission', 'Fair Work Ombudsman'],
    keyRequirements: [
      'Primary duty of care (PCBU obligations)',
      'Risk assessment and control',
      'Incident notification',
      'Consultation and representation',
      'Training and competency',
    ],
  },
  construction: {
    id: 'construction',
    name: 'Construction',
    fullName: 'WHS Regulations - Construction Work',
    authority: 'WorkSafe',
    icon: 'HardHat',
    color: 'amber',
    description: 'Construction industry safety compliance',
    keyAreas: [
      'Safe Work Method Statements',
      'Principal Contractor Duties',
      'High Risk Work Licensing',
      'Working at Heights',
      'Excavation Safety',
      'Asbestos Management',
      'Electrical Safety',
      'Plant & Equipment',
    ],
    regulations: [
      'WHS Regulations - Construction Work',
      'Building Act 2011 (WA)',
      'High Risk Work Licensing',
    ],
    authorities: ['WorkSafe WA', 'Building and Energy WA'],
    keyRequirements: [
      'Safe Work Method Statements (SWMS)',
      'Principal Contractor obligations',
      'High risk work licenses',
      'Asbestos management',
    ],
  },
} as const;

// Type exports
export type SectorId = keyof typeof SECTORS;
export type Sector = (typeof SECTORS)[SectorId];

// Helper arrays
export const SECTOR_IDS = Object.keys(SECTORS) as SectorId[];
export const SECTOR_LIST = Object.values(SECTORS);

// Validation helper
export function isValidSector(sector: string): sector is SectorId {
  return sector in SECTORS;
}

// Get sector by ID with type safety
export function getSector(id: string): Sector | undefined {
  if (isValidSector(id)) {
    return SECTORS[id];
  }
  return undefined;
}

// For backwards compatibility with existing code
export const ALL_SECTORS = SECTOR_LIST.map((s) => ({
  id: s.id,
  name: s.name,
  fullName: s.fullName,
  icon: s.icon,
  color: s.color,
  description: s.description,
}));
