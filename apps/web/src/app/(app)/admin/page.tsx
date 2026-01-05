'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function AdminPage() {
  const stats = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await api.get('/admin/stats')).data
  });

  return (
    <Card>
      <h2 className="mb-5 text-lg font-semibold text-white">System statistics</h2>
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(stats.data ?? {}).map(([key, value]) => (
          <div key={key} className="rounded-md border border-border bg-panel p-4">
            <p className="text-sm capitalize text-slate-400">{key}</p>
            <p className="mt-2 text-2xl font-semibold text-white">{String(value)}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
