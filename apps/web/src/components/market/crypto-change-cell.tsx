export function CryptoChangeCell({ value }: { value?: number }) {
  const isPositive = Number(value ?? 0) >= 0;

  return (
    <td className={isPositive ? 'text-success' : 'text-danger'}>
      <span className="inline-flex items-center gap-1 font-semibold">
        <span
          className={
            isPositive
              ? 'h-0 w-0 border-x-[4px] border-b-[6px] border-x-transparent border-b-success'
              : 'h-0 w-0 border-x-[4px] border-t-[6px] border-x-transparent border-t-danger'
          }
        />
        {Math.abs(Number(value ?? 0)).toFixed(2)}%
      </span>
    </td>
  );
}
