import { buildSparklinePath } from '@/components/market/market-format';

export function CryptoDetailChart({ values }: { values: number[] }) {
  const path = buildSparklinePath(values.slice(-120), 640, 240, 20);

  return (
    <svg viewBox="0 0 640 240" className="h-72 w-full" aria-hidden="true">
      <path d={path} fill="none" stroke="rgb(var(--color-primary))" strokeWidth="3" />
    </svg>
  );
}
