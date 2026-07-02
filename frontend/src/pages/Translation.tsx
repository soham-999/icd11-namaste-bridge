// src/pages/Translation.tsx
import { AppShell } from '../components/layout/Appshell';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { TerminologySearch } from '../components/mapping/TerminologySearch';
import { Button } from '../components/ui/Buttons';

export default function TranslationConsolePage() {
  return (
    <AppShell>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-brand">🔤 Translation Console</h1>
        <p className="text-sm text-slate-500 mt-0.5">ICD-11 ⇄ NAMASTE terminology mapping &amp; search.</p>
      </div>
      <Card className="max-w-3xl">
        <CardHeader><CardTitle>🔎 ICD11 ↔ NAMASTE</CardTitle></CardHeader>
        <TerminologySearch />
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button fullWidthOnMobile>📌 View Mapping Explanation</Button>
          <Button variant="ghost" fullWidthOnMobile>🕘 Mapping History</Button>
        </div>
      </Card>
    </AppShell>
  );
}