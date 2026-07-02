// src/pages/Admin.tsx
import { AppShell } from '../components/layout/AppShell';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const USERS = [
  { name: 'Dr. Ananya Rao', role: 'Doctor', dept: 'Ayurveda', status: 'Active' },
  { name: 'Priya Kulkarni', role: 'Operator', dept: 'Front Desk', status: 'Active' },
];

const AUDIT_LOGS = [
  { action: 'Mapping committed — Amavata → 1810.0', by: 'Dr. Ananya Rao', time: '10:15 AM' },
  { action: 'Specialist availability updated — Unani', by: 'Admin', time: '09:40 AM' },
];

export default function AdminPage() {
  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-brand">⚙️ Administration</h1>
        <p className="text-sm text-slate-500 mt-0.5">User management, roles &amp; permissions, audit logs.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>👥 User Management</CardTitle></CardHeader>
          <div className="space-y-3">
            {USERS.map((u) => (
              <div key={u.name} className="flex items-center justify-between">
                <div><p className="text-sm font-medium text-brand">{u.name}</p><p className="text-xs text-slate-500">{u.role} · {u.dept}</p></div>
                <Badge tone="success">{u.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader><CardTitle>🧾 Audit Logs</CardTitle></CardHeader>
          <div className="space-y-3">
            {AUDIT_LOGS.map((log, i) => (
              <div key={i} className="text-sm"><p className="text-brand font-medium">{log.action}</p><p className="text-xs text-slate-500">{log.by} · {log.time}</p></div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}