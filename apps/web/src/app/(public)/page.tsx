import Link from 'next/link';
import { ArrowRight, LineChart, Lock, type LucideIcon, Zap } from 'lucide-react';
import { CryptoMarketTable } from '@/components/market/crypto-market-table';
import { MarketSummaryStrip } from '@/components/market/market-summary-strip';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const highlights: Array<[string, string, LucideIcon]> = [
  ['Realtime markets', 'Socket.io ticks and animated chart surfaces.', LineChart],
  ['Secure auth', 'JWT access tokens, refresh rotation, and role guards.', Lock],
  ['Scalable modules', 'NestJS clean architecture with Prisma persistence.', Zap]
];

export default function LandingPage() {
  return (
    <main className="min-h-screen px-5 py-6">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-slate-950">B</span>
          Broker
        </Link>
        <Button asChild>
          <Link href="/login">Launch app</Link>
        </Button>
      </nav>
      <MarketSummaryStrip />
      <CryptoMarketTable />
      <section className="mx-auto grid min-h-[calc(100vh-88px)] max-w-6xl items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Mock trading platform</p>
          <h1 className="max-w-3xl text-5xl font-bold leading-tight text-foreground lg:text-7xl">Broker trading dashboard</h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            A production-minded paper trading workspace with realtime market updates, portfolio analytics, secure auth, and admin tooling.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/register">
                Create account
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/login">Use demo login</Link>
            </Button>
          </div>
        </div>
        <Card className="grid gap-4">
          {highlights.map(([title, body, Icon]) => (
            <div key={title} className="flex gap-4 rounded-md border border-border bg-panel p-4">
              <Icon className="mt-1 text-primary" size={22} />
              <div>
                <h2 className="font-semibold text-foreground">{title}</h2>
                <p className="text-sm text-muted">{body}</p>
              </div>
            </div>
          ))}
        </Card>
      </section>
    </main>
  );
}
