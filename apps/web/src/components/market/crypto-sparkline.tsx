import { buildSparklinePath } from '@/components/market/market-format';

export function CryptoSparkline({ values, positive }: { values: number[]; positive: boolean }) {
  const path = buildSparklinePath(values.slice(-60), 140, 48, 6);

  return (
    <svg viewBox="0 0 140 48" className="h-12 w-36" aria-hidden="true">
      <path d={path} fill="none" stroke={positive ? 'rgb(var(--color-success))' : 'rgb(var(--color-danger))'} strokeWidth="2" />
    </svg>
  );
}
