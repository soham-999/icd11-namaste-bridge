export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  sex: string;
  diseaseCaused: string;
  icdCode: string;
  namasteCode: string;
  medicationsRequired: string[];
  testsDone: string[];
  status: string;
  department: string;
  bp: string;
  pulse: string;
  spo2: string;
  temp: string;
  weight: string;
  lastVisit: string;
}

const DEFAULT_SEEDS: PatientRecord[] = [
  {
    id: "PT00125",
    name: "James Carter",
    age: 38,
    sex: "Male",
    diseaseCaused: "Amavata (Rheumatoid Arthritis)",
    icdCode: "1B10.0",
    namasteCode: "A-AM-01",
    medicationsRequired: ["Sudarshan Vati", "Shunthi Churna"],
    testsDone: ["RF Factor", "CRP"],
    status: "In Patient",
    department: "Ayurveda",
    bp: "120/80", pulse: "76", spo2: "98", temp: "98.6", weight: "72kg",
    lastVisit: "25 May 2026"
  },
  {
    id: "PT00126",
    name: "Emily Davis",
    age: 29,
    sex: "Female",
    diseaseCaused: "Waja-ul-mafasil (Osteoarthritis)",
    icdCode: "FA00.Z",
    namasteCode: "U-WM-04",
    medicationsRequired: ["Habb-e-Asgand", "Roghan-e-Surkh"],
    testsDone: ["X-Ray Knee"],
    status: "Out Patient",
    department: "Unani",
    bp: "118/76", pulse: "72", spo2: "99", temp: "98.4", weight: "58kg",
    lastVisit: "28 May 2026"
  }
];

export const INTEGRATION_API = {
  // LocalStorage mapping layer configuration
  fetchPatients: async (): Promise<PatientRecord[]> => {
    const localData = localStorage.getItem('ayush_emr_records');
    if (!localData) {
      localStorage.setItem('ayush_emr_records', JSON.stringify(DEFAULT_SEEDS));
      return DEFAULT_SEEDS;
    }
    return JSON.parse(localData);
  },

  commitPatient: async (record: Omit<PatientRecord, 'id' | 'lastVisit'>): Promise<PatientRecord> => {
    const current = await INTEGRATION_API.fetchPatients();
    const newRecord: PatientRecord = {
      ...record,
      id: `PT00${125 + current.length}`,
      lastVisit: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    const updated = [newRecord, ...current];
    localStorage.setItem('ayush_emr_records', JSON.stringify(updated));
    return newRecord;
  },

  autoMapDisease: (term: string) => {
    const lower = term.toLowerCase();
    if (lower.includes('amavata') || lower.includes('rheumatoid') || lower.includes('arthritis')) {
      return { icd: "1B10.0", namaste: "A-AM-01", dept: "Ayurveda", meds: "Sudarshan Vati, Shunthi Churna" };
    }
    if (lower.includes('waja') || lower.includes('mafasil') || lower.includes('osteoarthritis')) {
      return { icd: "FA00.Z", namaste: "U-WM-04", dept: "Unani", meds: "Habb-e-Asgand, Roghan-e-Surkh" };
    }
    return null;
  }
};