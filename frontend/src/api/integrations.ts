import { backendApi, USE_SAMPLE_DATA } from './client';
import { sampleApiKeys } from './sampleData';
import type { ApiKeyRecord } from './types';

export async function getApiKeys(): Promise<ApiKeyRecord[]> {
  if (USE_SAMPLE_DATA) return sampleApiKeys;
  try {
    const { data } = await backendApi.get<ApiKeyRecord[]>('/integrations/keys');
    return data;
  } catch { return sampleApiKeys; }
}

export async function generateApiKey(systemName: string): Promise<{ key: ApiKeyRecord; secret: string }> {
  if (USE_SAMPLE_DATA) {
    const secret = `nic_live_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`;
    const key: ApiKeyRecord = {
      id: `key-${Date.now()}`,
      systemName,
      keyPreview: `nic_live_••••${secret.slice(-4)}`,
      status: 'Active',
      createdAt: new Date().toISOString(),
    };
    return { key, secret };
  }
  const { data } = await backendApi.post('/integrations/keys', { systemName });
  return data;
}

export async function revokeApiKey(id: string): Promise<ApiKeyRecord> {
  const { data } = await backendApi.post(`/integrations/keys/${id}/revoke`);
  return data;
}