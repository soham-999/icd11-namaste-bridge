// src/api/patients.ts
import { backendApi, USE_SAMPLE_DATA } from './client';
import { samplePatients, samplePatientTimeline } from './sampleData';
import type { Patient, PatientTimelineEvent } from './types';

export async function getPatients(): Promise<Patient[]> {
  if (USE_SAMPLE_DATA) return samplePatients;
  try {
    const { data } = await backendApi.get<Patient[]>('/patients');
    return data;
  } catch { return samplePatients; }
}

export async function getPatientTimeline(patientId: string): Promise<PatientTimelineEvent[]> {
  if (USE_SAMPLE_DATA) return samplePatientTimeline[patientId] ?? [];
  try {
    const { data } = await backendApi.get<PatientTimelineEvent[]>(`/patients/${patientId}/timeline`);
    return data;
  } catch { return samplePatientTimeline[patientId] ?? []; }
}

export async function createPatient(payload: Omit<Patient, 'id'>): Promise<Patient> {
  const { data } = await backendApi.post<Patient>('/patients', payload);
  return data;
}