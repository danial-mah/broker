export function CryptoDetailStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-panel p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function CryptoPercentChange({ value }: { value?: number }) {
  const positive = Number(value ?? 0) >= 0;
  return <span className={positive ? 'font-semibold text-success' : 'font-semibold text-danger'}>{Number(value ?? 0).toFixed(2)}%</span>;
}
