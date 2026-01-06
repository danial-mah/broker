'use client';

import { useQuery } from '@tanstack/react-query';
import { Activity, PieChart, TrendingUp, type LucideIcon, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { MarketChart } from '@/components/market/market-chart';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const wallet = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => (await api.get('/wallet')).data
  });
  const portfolio = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => (await api.get('/trading/portfolio')).data
  });

  const cash = Number(wallet.data?.cashBalance ?? 0);
  const invested = (portfolio.data ?? []).reduce((sum: number, position: any) => {
    return sum + Number(position.quantity) * Number(position.asset.price);
  }, 0);
  const metrics: Array<[string, string, LucideIcon]> = [
    ['Cash balance', formatCurrency(cash), Wallet],
    ['Portfolio value', formatCurrency(invested), PieChart],
    ['Open positions', String(portfolio.data?.length ?? 0), Activity],
    ['Daily P/L', '+2.42%', TrendingUp]
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, Icon]) => (
          <Card key={label}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">{label}</p>
              <Icon size={18} className="text-primary" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
          </Card>
        ))}
      </section>
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Market pulse</h2>
            <p className="text-sm text-slate-400">Mock intraday movement</p>
          </div>
          <span className="rounded-md bg-primary/10 px-3 py-1 text-sm text-primary">Live</span>
        </div>
        <MarketChart />
      </Card>
    </div>
  );
}
