'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function WalletPage() {
  const wallet = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => (await api.get('/wallet')).data
  });

  return (
    <Card>
      <p className="text-sm text-slate-400">Available cash</p>
      <h2 className="mb-6 text-4xl font-bold text-white">{formatCurrency(Number(wallet.data?.cashBalance ?? 0))}</h2>
      <div className="space-y-3">
        {(wallet.data?.walletTxs ?? []).map((tx: any) => (
          <div key={tx.id} className="flex justify-between rounded-md border border-border bg-panel p-4">
            <span>{tx.type}</span>
            <span>{formatCurrency(Number(tx.amount))}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
