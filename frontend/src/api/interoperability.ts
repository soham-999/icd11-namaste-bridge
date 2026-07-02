// src/api/interoperability.ts
import { backendApi, USE_SAMPLE_DATA } from './client';
import { sampleInteropStats, sampleTransactions } from './sampleData';
import type { InteropStats, InteropTransaction } from './types';

export async function getInteropStats(): Promise<InteropStats> {
  if (USE_SAMPLE_DATA) return sampleInteropStats;
  try {
    const { data } = await backendApi.get<InteropStats>('/interoperability/stats');
    return data;
  } catch { return sampleInteropStats; }
}

export async function getTransactions(): Promise<InteropTransaction[]> {
  if (USE_SAMPLE_DATA) return sampleTransactions;
  try {
    const { data } = await backendApi.get<InteropTransaction[]>('/interoperability/transactions');
    return data;
  } catch { return sampleTransactions; }
}

export async function retryFailedTransactions(): Promise<{ retried: number }> {
  const { data } = await backendApi.post('/interoperability/retry-failed');
  return data;
}