import {
  FearGreedSummaryCard,
  MetricSummaryCard,
  NewsSummaryCard,
  RangeSummaryCard,
  sparklinePaths
} from '@/components/market/market-summary-cards';

export function MarketSummaryStrip() {
  return (
    <section className="mx-auto mt-8 max-w-7xl overflow-x-auto pb-2">
      <div className="grid min-w-max grid-cols-6 gap-4 lg:min-w-0">
        <MetricSummaryCard title="Market Cap" value="$2.61T" change="0.28%" path={sparklinePaths.marketCap} />
        <MetricSummaryCard title="CMC20" value="$158.79" change="0.43%" path={sparklinePaths.cmc20} />
        <FearGreedSummaryCard />
        <RangeSummaryCard
          title="Altcoin Season"
          value="32"
          left="Bitcoin"
          right="Altcoin"
          marker="left-[32%]"
          colors="bg-gradient-to-r from-orange-500 via-blue-200 to-blue-600"
        />
        <RangeSummaryCard
          title="Average Crypto RSI"
          value="41.18"
          left="Oversold"
          right="Overbought"
          marker="left-[41%]"
          colors="bg-gradient-to-r from-primary via-slate-300 to-danger"
        />
        <NewsSummaryCard />
      </div>
    </section>
  );
}
