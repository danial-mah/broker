'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function PortfolioPage() {
  const portfolio = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => (await api.get('/trading/portfolio')).data
  });

  return (
    <Card>
      <h2 className="mb-5 text-lg font-semibold text-white">Open positions</h2>
      <div className="grid gap-3">
        {(portfolio.data ?? []).map((position: any) => (
          <div key={position.id} className="grid gap-2 rounded-md border border-border bg-panel p-4 md:grid-cols-4">
            <strong>{position.asset.symbol}</strong>
            <span>{Number(position.quantity).toLocaleString()} units</span>
            <span>Avg {formatCurrency(Number(position.averageCost))}</span>
            <span>Now {formatCurrency(Number(position.asset.price))}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
