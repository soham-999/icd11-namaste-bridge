import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Buttons';
import { getApiKeys, generateApiKey } from '../../api/integrations';
import { formatDate } from '../../utils';
import { KeyRound, Copy, Check } from 'lucide-react';

export function ApiKeysPanel() {
  const queryClient = useQueryClient();
  const { data: keys } = useQuery({ queryKey: ['api-keys'], queryFn: getApiKeys });

  const [systemName, setSystemName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!systemName.trim()) return;
    setGenerating(true);
    try {
      const { secret } = await generateApiKey(systemName.trim());
      setNewSecret(secret);
      setSystemName('');
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
    } finally {
      setGenerating(false);
    }
  }

  function copySecret() {
    if (!newSecret) return;
    navigator.clipboard.writeText(newSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔑 API Integrations</CardTitle>
      </CardHeader>
      <p className="text-xs text-slate-500 -mt-3 mb-4">
        Generate API keys so external EHR systems (hospitals, ABDM sandbox, third-party integrators) can securely push/pull data through this platform.
      </p>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          value={systemName}
          onChange={(e) => setSystemName(e.target.value)}
          placeholder="e.g. Fortis Hospital EHR"
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent"
        />
        <Button onClick={handleGenerate} disabled={generating || !systemName.trim()} fullWidthOnMobile>
          <KeyRound size={16} />
          {generating ? 'Generating…' : 'Generate New API Key'}
        </Button>
      </div>

      {newSecret && (
        <div className="mb-4 rounded-lg border border-warning/30 bg-warning-light p-3">
          <p className="text-xs font-semibold text-warning mb-1">⚠️ Copy this now — it won't be shown again</p>
          <div className="flex items-center gap-2 bg-white rounded-md px-3 py-2 border border-slate-200">
            <code className="text-xs flex-1 truncate">{newSecret}</code>
            <button onClick={copySecret} className="text-slate-500 hover:text-brand">
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      )}

      <div className="hidden sm:block overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-surface text-slate-500 text-xs">
            <tr>
              <th className="text-left font-medium px-3 py-2">System</th>
              <th className="text-left font-medium px-3 py-2">API Key</th>
              <th className="text-left font-medium px-3 py-2">Created</th>
              <th className="text-left font-medium px-3 py-2">Last Used</th>
              <th className="text-left font-medium px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {keys?.map((k) => (
              <tr key={k.id} className="hover:bg-surface/60">
                <td className="px-3 py-2.5 font-medium text-brand">{k.systemName}</td>
                <td className="px-3 py-2.5 text-slate-600 font-mono text-xs">{k.keyPreview}</td>
                <td className="px-3 py-2.5 text-slate-600">{formatDate(k.createdAt)}</td>
                <td className="px-3 py-2.5 text-slate-600">{k.lastUsed ? formatDate(k.lastUsed) : '—'}</td>
                <td className="px-3 py-2.5"><Badge tone={k.status === 'Active' ? 'success' : 'danger'}>{k.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-2">
        {keys?.map((k) => (
          <div key={k.id} className="rounded-lg border border-slate-200 p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-brand">{k.systemName}</p>
              <Badge tone={k.status === 'Active' ? 'success' : 'danger'}>{k.status}</Badge>
            </div>
            <p className="text-xs text-slate-500 font-mono">{k.keyPreview}</p>
            <p className="text-[11px] text-slate-400 mt-1">Created {formatDate(k.createdAt)}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}