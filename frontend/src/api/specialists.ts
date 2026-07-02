// src/api/specialists.ts
import { backendApi, USE_SAMPLE_DATA } from './client';
import { sampleSpecialists } from './sampleData';
import type { Specialist } from './types';

export async function getSpecialists(): Promise<Specialist[]> {
  if (USE_SAMPLE_DATA) return sampleSpecialists;
  try {
    const { data } = await backendApi.get<Specialist[]>('/specialists');
    return data;
  } catch { return sampleSpecialists; }
}