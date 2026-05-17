'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { CryptoAboutCard } from '@/components/market/crypto-about-card';
import { CryptoDetailHeader } from '@/components/market/crypto-detail-header';
import { CryptoLinksCard } from '@/components/market/crypto-links-card';
import { CryptoMarketDataCard } from '@/components/market/crypto-market-data-card';
import type { CryptoDetail } from '@/components/market/crypto-market-types';
import { api } from '@/lib/api';

export default function PublicCryptoDetailPage() {
  const params = useParams<{ id: string }>();
  const asset = useQuery({
    queryKey: ['crypto-detail', params.id],
    queryFn: async () => (await api.get<CryptoDetail>(`/market/crypto/${params.id}`)).data
  });

  if (asset.isLoading) {
    return <main className="grid min-h-screen place-items-center text-muted">Loading asset...</main>;
  }

  if (!asset.data) {
    return <main className="grid min-h-screen place-items-center text-muted">Asset not found.</main>;
  }

  return (
    <main className="min-h-screen px-5 py-6">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ArrowLeft size={16} />
          Back to markets
        </Link>
        <section className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <CryptoDetailHeader asset={asset.data} />
          <div className="space-y-6">
            <CryptoMarketDataCard asset={asset.data} />
          </div>
        </section>
        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
          <CryptoAboutCard asset={asset.data} />
          <CryptoLinksCard links={asset.data.links} />
        </section>
      </div>
    </main>
  );
}
