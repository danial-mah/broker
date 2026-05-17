import { BadgeCheck, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const sparklinePaths = {
  marketCap: 'M2 40 L18 39 L32 40 L44 39 L54 40 L62 62 L72 46 L88 41 L104 39 L118 33 L134 35 L150 34 L166 35 L184 34 L200 36 L216 37 L228 33 L236 8 L246 31 L258 34 L270 26 L282 42 L298 39',
  cmc20: 'M2 38 L18 37 L34 38 L50 37 L66 41 L78 63 L90 47 L104 40 L120 34 L136 38 L154 37 L172 38 L190 37 L208 38 L226 39 L242 37 L258 34 L272 35 L284 32 L298 11'
};

function MiniSparkline({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 300 72" className="mt-2 h-11 w-full" aria-hidden="true">
      <path d={path} fill="none" stroke="rgb(var(--color-primary))" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
    </svg>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1 flex items-center gap-1 text-sm font-semibold text-foreground">
      {children}
      <ChevronRight size={16} className="text-muted" />
    </div>
  );
}

function MetricCard({ title, value, change, path }: { title: string; value: string; change: string; path: string }) {
  return (
    <div className="min-w-[260px] rounded-2xl border border-border bg-surface p-4 shadow-glow lg:min-w-0">
      <CardTitle>{title}</CardTitle>
      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold leading-none text-foreground">{value}</p>
        <p className="flex items-center gap-1 text-sm font-semibold text-success">
          <span className="h-0 w-0 border-x-[4px] border-b-[6px] border-x-transparent border-b-success" />
          {change}
        </p>
      </div>
      <MiniSparkline path={path} />
    </div>
  );
}

function FearGreedCard() {
  return (
    <div className="min-w-[260px] rounded-2xl border border-primary bg-surface p-4 shadow-glow lg:min-w-0">
      <CardTitle>Fear & Greed</CardTitle>
      <div className="relative mx-auto mt-2 h-24 w-40">
        <div className="absolute inset-x-0 bottom-0 h-20 rounded-t-full border-[8px] border-b-0 border-danger" />
        <div className="absolute inset-x-3 bottom-0 h-[72px] rounded-t-full border-[8px] border-b-0 border-orange-400" />
        <div className="absolute inset-x-8 bottom-0 h-16 rounded-t-full border-[8px] border-b-0 border-lime-500" />
        <div className="absolute left-[72px] top-1 h-4 w-4 rounded-full border-2 border-surface bg-foreground" />
        <div className="absolute inset-x-0 bottom-0 text-center">
          <p className="text-3xl font-bold text-foreground">42</p>
          <p className="text-sm text-muted">Neutral</p>
        </div>
      </div>
    </div>
  );
}

function RangeCard({
  title,
  value,
  left,
  right,
  marker,
  colors
}: {
  title: string;
  value: string;
  left: string;
  right: string;
  marker: string;
  colors: string;
}) {
  return (
    <div className="min-w-[260px] rounded-2xl border border-border bg-surface p-4 shadow-glow lg:min-w-0">
      <CardTitle>{title}</CardTitle>
      <p className="text-3xl font-bold leading-none text-foreground">
        {value}
        {title === 'Fear & Greed' && <span className="text-muted">/100</span>}
      </p>
      <div className="mt-4 flex justify-between text-sm text-muted">
        <span>{left}</span>
        <span>{right}</span>
      </div>
      <div className={cn('relative mt-3 h-2 rounded-full', colors)}>
        <span className={cn('absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-4 border-surface bg-foreground', marker)} />
      </div>
    </div>
  );
}

function NewsCard() {
  return (
    <div className="min-w-[260px] rounded-2xl border border-border bg-surface p-4 shadow-glow lg:min-w-0">
      <div className="mb-3 flex items-center gap-2">
        <div className="grid h-6 w-6 place-items-center rounded-full bg-panel text-xs">CT</div>
        <p className="font-semibold text-foreground">Cointelegraph</p>
        <BadgeCheck size={18} className="fill-blue-500 text-surface" />
        <span className="text-sm text-muted">6h</span>
      </div>
      <p className="line-clamp-3 text-sm leading-5 text-foreground">
        THROWBACK: On May 17, 2010, programmer Laszlo Hanyecz offered 10,000 BTC for two pizzas, setting up one of crypto's most famous stories.
      </p>
    </div>
  );
}

export function MarketSummaryStrip() {
  return (
    <section className="mx-auto mt-8 max-w-7xl overflow-x-auto pb-2">
      <div className="grid min-w-max grid-cols-6 gap-4 lg:min-w-0">
        <MetricCard title="Market Cap" value="$2.61T" change="0.28%" path={sparklinePaths.marketCap} />
        <MetricCard title="CMC20" value="$158.79" change="0.43%" path={sparklinePaths.cmc20} />
        <FearGreedCard />
        <RangeCard
          title="Altcoin Season"
          value="32"
          left="Bitcoin"
          right="Altcoin"
          marker="left-[32%]"
          colors="bg-gradient-to-r from-orange-500 via-blue-200 to-blue-600"
        />
        <RangeCard
          title="Average Crypto RSI"
          value="41.18"
          left="Oversold"
          right="Overbought"
          marker="left-[41%]"
          colors="bg-gradient-to-r from-primary via-slate-300 to-danger"
        />
        <NewsCard />
      </div>
    </section>
  );
}
