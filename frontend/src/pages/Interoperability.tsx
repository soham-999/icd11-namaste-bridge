// src/pages/Interoperability.tsx
import { useQuery } from '@tanstack/react-query';
import { AppShell } from '../components/layout/Appshell';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { RetryTransactionsButton } from '../components/patient/RetryTransactionsButton';
import {ApiKeysPanel}from '../components/patient/ApiKeysPanel';
import { getInteropStats, getTransactions } from '../api/interoperability';
import { formatNumber, formatTime } from '../utils';
import type { SyncStatus } from '../api/types';

const STATUS_TONE: Record<SyncStatus, 'success' | 'danger' | 'warning'> = { Success: 'success', Failed: 'danger', Pending: 'warning' };

export default function InteroperabilityPage() {
  const { data: stats } = useQuery({ queryKey: ['interop-stats'], queryFn: getInteropStats });
  const { data: transactions } = useQuery({ queryKey: ['interop-transactions'], queryFn: getTransactions });

  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-brand">🔗 Interoperability Monitor</h1>
        <p className="text-sm text-slate-500 mt-0.5">Live sync status between EHR systems and the mapping engine.</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
          <Card><p className="text-xs text-slate-500">🔄 Records Synced</p><p className="text-xl sm:text-2xl font-bold text-brand mt-1">{formatNumber(stats.recordsSynced)}</p></Card>
          <Card><p className="text-xs text-slate-500">❌ Failed Requests</p><p className="text-xl sm:text-2xl font-bold text-danger mt-1">{stats.failedRequests}</p></Card>
          <Card><p className="text-xs text-slate-500">✅ Success Rate</p><p className="text-xl sm:text-2xl font-bold text-success mt-1">{stats.successRatePct}%</p></Card>
          <Card><p className="text-xs text-slate-500">⚡ Avg. Latency</p><p className="text-xl sm:text-2xl font-bold text-brand mt-1">{stats.avgLatencyMs} ms</p></Card>
        </div>
      )}

      <Card>
        <CardHeader><CardTitle>🧾 Recent Transactions</CardTitle></CardHeader>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-500 text-xs border-b border-slate-100">
              <tr>
                <th className="text-left font-medium py-2">Time</th>
                <th className="text-left font-medium py-2">Hospital</th>
                <th className="text-left font-medium py-2">Record / Code</th>
                <th className="text-left font-medium py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions?.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface/60">
                  <td className="py-2.5 text-slate-600">{formatTime(tx.time)}</td>
                  <td className="py-2.5 text-brand font-medium">{tx.hospital}</td>
                  <td className="py-2.5 text-slate-600">{tx.recordCode}</td>
                  <td className="py-2.5"><Badge tone={STATUS_TONE[tx.status]}>{tx.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden space-y-2">
          {transactions?.map((tx) => (
            <div key={tx.id} className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-semibold text-brand">{tx.hospital}</p>
                <Badge tone={STATUS_TONE[tx.status]}>{tx.status}</Badge>
              </div>
              <p className="text-xs text-slate-500">{formatTime(tx.time)} · {tx.recordCode}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <RetryTransactionsButton />
          <button className="text-sm font-semibold text-accent hover:underline">View All Logs →</button>
        </div>
      </Card>
       <div className="mt-4">
        <ApiKeysPanel />
       </div>
    </AppShell>
  );
}