// src/api/mapping.ts
import { mappingApi, USE_SAMPLE_DATA } from './client';
import { sampleBestMatch, sampleAlternativeMatches } from './sampleData';
import type { TerminologyMapping } from './types';

export interface MappingSearchResult {
  bestMatch: TerminologyMapping | null;
  alternatives: TerminologyMapping[];
}

export async function searchTerminology(query: string): Promise<MappingSearchResult> {
  if (!query.trim()) return { bestMatch: null, alternatives: [] };
  if (USE_SAMPLE_DATA) return { bestMatch: sampleBestMatch, alternatives: sampleAlternativeMatches };
  try {
    const { data } = await mappingApi.get<MappingSearchResult>('/mapping/search', { params: { q: query } });
    return data;
  } catch { return { bestMatch: sampleBestMatch, alternatives: sampleAlternativeMatches }; }
}

export async function commitMapping(payload: {
  patientId?: string; icd11Code: string; namasteCode: string; department: string;
}): Promise<{ success: boolean; recordId?: string }> {
  const { data } = await mappingApi.post('/mapping/commit', payload);
  return data;
}