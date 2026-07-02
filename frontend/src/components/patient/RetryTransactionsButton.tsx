// src/components/patient/RetryTransactionsButton.tsx
import { useState } from 'react';
import { Button } from '../ui/Buttons';
import { retryFailedTransactions } from '../../api/interoperability';
import { RefreshCw } from 'lucide-react';

export function RetryTransactionsButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleRetry() {
    setLoading(true);
    setMessage(null);
    try {
      const result = await retryFailedTransactions();
      setMessage(`✅ Retried ${result.retried} transaction(s)`);
    } catch {
      setMessage('⚠️ Retry endpoint not reachable — check backend connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <Button onClick={handleRetry} disabled={loading} fullWidthOnMobile>
        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        {loading ? 'Retrying…' : 'Retry Failed Transactions'}
      </Button>
      {message && <span className="text-xs text-slate-500">{message}</span>}
    </div>
  );
}