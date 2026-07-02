// src/api/sampleData.ts
import type {
  DashboardStats, AppointmentTrendPoint, ActivityItem, Patient, PatientTimelineEvent,
  TerminologyMapping, Specialist, InteropTransaction, InteropStats, ApiKeyRecord,
} from './types';


export const sampleDashboardStats: DashboardStats = {
  totalPatients: 110, patientsGrowthPct: 20,
  totalAppointments: 658, appointmentsGrowthPct: -15,
  totalAyushExperts: 565, expertsGrowthPct: 18,
  totalTransactions: 56523.56, transactionsGrowthPct: 12,
};

export const sampleAppointmentTrend: AppointmentTrendPoint[] = [
  { day: '01', appointments: 42 }, { day: '04', appointments: 55 },
  { day: '07', appointments: 38 }, { day: '10', appointments: 61 },
  { day: '14', appointments: 47 }, { day: '17', appointments: 70 },
  { day: '21', appointments: 58 }, { day: '24', appointments: 65 },
  { day: '28', appointments: 52 },
];

export const sampleActivity: ActivityItem[] = [
  { id: 'act-1', type: 'patient_registered', description: 'Patient registered — John Doe', timestamp: '2026-06-30T10:30:00' },
  { id: 'act-2', type: 'mapping_created', description: 'Mapping created — Amavata → 1810.0', timestamp: '2026-06-30T10:15:00' },
  { id: 'act-3', type: 'data_synced', description: 'Data synced — Apollo Hospital', timestamp: '2026-06-30T09:58:00' },
];

export const samplePatients: Patient[] = [
  { id: 'PT-10023', name: 'John Doe', age: 30, gender: 'Male', hospital: 'Apollo Hospital', lastVisit: '2026-06-10' },
  { id: 'PT-10024', name: 'Sudarshan Vati', age: 45, gender: 'Male', hospital: 'City Clinic', lastVisit: '2026-06-08' },
  { id: 'PT-10025', name: 'Meera Nair', age: 27, gender: 'Female', hospital: 'ABC Hospital', lastVisit: '2026-06-05' },
  { id: 'PT-10026', name: 'Rakesh Verma', age: 52, gender: 'Male', hospital: 'Rural PHC', lastVisit: '2026-06-01' },
];

export const samplePatientTimeline: Record<string, PatientTimelineEvent[]> = {
  'PT-10023': [
    { id: 'tl-1', type: 'visit_created', title: 'Visit Created', description: 'Symptoms captured', date: '2026-05-28T00:00:00' },
    { id: 'tl-2', type: 'diagnosis', title: 'Diagnosis', description: 'Amavata (Auto-mapped)', date: '2026-05-28T00:00:00' },
    { id: 'tl-3', type: 'mapping', title: 'Mapping', description: 'ICD-11: 1810.0', date: '2026-05-28T00:00:00' },
    { id: 'tl-4', type: 'prescription', title: 'Prescription', description: 'Sudarshan Vati, etc.', date: '2026-05-28T00:00:00' },
    { id: 'tl-5', type: 'follow_up', title: 'Follow-up', description: 'Improvement', date: '2026-06-10T00:00:00' },
  ],
};

export const sampleBestMatch: TerminologyMapping = {
  icd11Code: '1810.0', icd11Term: 'Rheumatoid Arthritis',
  namasteCode: 'A-AM-01', namasteTerm: 'Amavata', matchScore: 94, isBestMatch: true,
};

export const sampleAlternativeMatches: TerminologyMapping[] = [
  { icd11Code: 'FA00.Z', icd11Term: 'Joint disorder, unspecified', namasteCode: 'U-AM-04', namasteTerm: 'Wajo-ul-mafasil', matchScore: 82, isBestMatch: false },
  { icd11Code: 'MG46', icd11Term: 'Fever, unspecified', namasteCode: 'A-JV-01', namasteTerm: 'Jwar', matchScore: 76, isBestMatch: false },
  { icd11Code: 'CA40.0', icd11Term: 'Bronchial asthma', namasteCode: 'A-TS-09', namasteTerm: 'Tamaka Shwasa', matchScore: 71, isBestMatch: false },
];

export const sampleSpecialists: Specialist[] = [
  { id: 'sp-1', name: 'Vaidya Harishankar Sharma', department: 'Ayurveda', availability: 'Available', qualification: 'BAMS, MD (Ayu)' },
  { id: 'sp-2', name: 'Hakim Aslam Khan', department: 'Unani', availability: 'Unavailable', qualification: 'BUMS' },
  { id: 'sp-3', name: 'Dr. Rajeswari Pillai', department: 'Siddha', availability: 'Available', qualification: 'BSMS' },
  //{ id: 'sp-4', name: 'Dr. Anil Kumar', department: 'Yoga', availability: 'Available', qualification: 'PhD (Yoga)' },
]

  export const sampleInteropStats: InteropStats = {
  recordsSynced: 1240,
  failedRequests: 8,
  successRatePct: 98.4,
  avgLatencyMs: 170,
};

export const sampleTransactions: InteropTransaction[] = [
  {
    id: 'tx-1',
    time: '2026-06-30T10:30:00',
    hospital: 'Apollo Hospital',
    recordCode: 'TM-ICD-001',
    status: 'Success',
  },
  {
    id: 'tx-2',
    time: '2026-06-30T10:15:00',
    hospital: 'AIIMS',
    recordCode: 'TM-ICD-014',
    status: 'Failed',
  },
  {
    id: 'tx-3',
    time: '2026-06-30T09:50:00',
    hospital: 'City Clinic',
    recordCode: 'TM-ICD-022',
    status: 'Pending',
  },
];
export const sampleApiKeys: ApiKeyRecord[] = [
  { id: 'key-1', systemName: 'Apollo Hospital EHR', keyPreview: 'nic_live_••••8f2a', status: 'Active', createdAt: '2026-05-12T00:00:00', lastUsed: '2026-06-30T10:30:00' },
  { id: 'key-2', systemName: 'City Clinic OpenMRS', keyPreview: 'nic_live_••••31c9', status: 'Active', createdAt: '2026-05-20T00:00:00', lastUsed: '2026-06-30T10:28:00' },
  { id: 'key-3', systemName: 'Rural PHC Bahmni', keyPreview: 'nic_live_••••e04d', status: 'Revoked', createdAt: '2026-04-02T00:00:00' },
];
