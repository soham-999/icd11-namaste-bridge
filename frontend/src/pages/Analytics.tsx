// src/pages/Analytics.tsx
import { AppShell } from '../components/layout/AppShell';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const DISEASE_INSIGHTS = [
  { term: 'Amavata (Rheumatoid Arthritis)', cases: 312, trend: '+8%' },
  { term: 'Jwar (Fever syndromes)', cases: 274, trend: '+3%' },
  { term: 'Tamaka Shwasa (Bronchial Asthma)', cases: 158, trend: '-4%' },
];

const OPERATIONAL_METRICS = [
  { label: '📈 Mapping Accuracy', value: '96.4%' },
  { label: '⏱️ Avg. Intake Time', value: '3m 40s' },
  { label: '🔁 Daily Sync Volume', value: '4,120 records' },
];

export default function AnalyticsPage() {
  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-brand">📊 Analytics &amp; Reports</h1>
        <p className="text-sm text-slate-500 mt-0.5">Disease insights, operational metrics &amp; custom reports.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {OPERATIONAL_METRICS.map((m) => (
          <Card key={m.label}><p className="text-xs text-slate-500">{m.label}</p><p className="text-xl font-bold text-brand mt-1">{m.value}</p></Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>🌿 Disease Insights — Top NAMASTE Terms</CardTitle></CardHeader>
        <div className="space-y-3">
          {DISEASE_INSIGHTS.map((d) => (
            <div key={d.term} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <div><p className="text-sm font-medium text-brand">{d.term}</p><p className="text-xs text-slate-500">{d.cases} cases this month</p></div>
              <Badge tone={d.trend.startsWith('+') ? 'success' : 'danger'}>{d.trend}</Badge>
            </div>
          ))}
        </div>
        <button className="mt-4 text-sm font-semibold text-accent hover:underline">📄 Generate Custom Report</button>
      </Card>
    </AppShell>
  );
}