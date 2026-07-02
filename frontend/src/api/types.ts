// src/api/types.ts
export type UserRole = 'Admin' | 'Doctor' | 'Operator' | 'Auditor' | 'Integrator';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
}

export interface DashboardStats {
  totalPatients: number;
  patientsGrowthPct: number;
  totalAppointments: number;
  appointmentsGrowthPct: number;
  totalAyushExperts: number;
  expertsGrowthPct: number;
  totalTransactions: number;
  transactionsGrowthPct: number;
}

export interface AppointmentTrendPoint { day: string; appointments: number; }

export interface ActivityItem {
  id: string;
  type: 'patient_registered' | 'mapping_created' | 'data_synced';
  description: string;
  timestamp: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  hospital?: string;
  lastVisit?: string;
}

export type TimelineEventType = 'visit_created' | 'diagnosis' | 'mapping' | 'prescription' | 'follow_up';

export interface PatientTimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  date: string;
}

export interface TerminologyMapping {
  icd11Code: string;
  icd11Term: string;
  namasteCode: string;
  namasteTerm: string;
  matchScore: number;
  isBestMatch: boolean;
}

export type AyushDepartment = 'Ayurveda' | 'Unani' | 'Siddha' | 'Homeopathy' | 'Yoga & Naturopathy';
export type SpecialistAvailability = 'Available' | 'Unavailable' | 'On Leave';

export interface Specialist {
  id: string;
  name: string;
  department: AyushDepartment;
  availability: SpecialistAvailability;
  qualification?: string;
}

export type SyncStatus = 'Success' | 'Failed' | 'Pending';

export interface InteropTransaction {
  id: string;
  time: string;
  hospital: string;
  recordCode: string;
  status: SyncStatus;
}

export interface InteropStats {
  recordsSynced: number;
  failedRequests: number;
  successRatePct: number;
  avgLatencyMs: number;
}
export type ApiKeyStatus = 'Active' | 'Revoked';

export interface ApiKeyRecord {
  id: string;
  systemName: string;      // e.g. "Apollo Hospital EHR"
  keyPreview: string;      // masked, e.g. "nic_live_••••8f2a"
  status: ApiKeyStatus;
  createdAt: string;
  lastUsed?: string;
}