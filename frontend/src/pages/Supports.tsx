// src/pages/Support.tsx
import { AppShell } from '../components/layout/AppShell';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const TICKETS = [
  { id: 'TCK-104', subject: 'Mapping mismatch for Wajo-ul-mafasil', status: 'Open' },
  { id: 'TCK-101', subject: 'Sync delay from Rural PHC', status: 'Resolved' },
];

export default function SupportPage() {
  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-brand">🛟 System &amp; Support</h1>
        <p className="text-sm text-slate-500 mt-0.5">Notifications, documentation, release notes &amp; support tickets.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>🎟️ Support Tickets</CardTitle></CardHeader>
          <div className="space-y-3">
            {TICKETS.map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-brand">{t.subject}</p><p className="text-xs text-slate-500">{t.id}</p></div>
                <Badge tone={t.status === 'Open' ? 'warning' : 'success'}>{t.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader><CardTitle>📚 Help &amp; Docs</CardTitle></CardHeader>
          <ul className="text-sm space-y-2 text-accent">
            <li className="hover:underline cursor-pointer">📖 Getting started with terminology mapping</li>
            <li className="hover:underline cursor-pointer">🔌 API integration guide (FHIR / ABDM)</li>
            <li className="hover:underline cursor-pointer">🆕 v1.0.0 Release Notes</li>
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}