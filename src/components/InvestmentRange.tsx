import { formatCurrency } from "@/lib/types";

interface InvestmentRangeProps {
  low: number;
  high: number;
  initialFee?: number;
  compact?: boolean;
}

export default function InvestmentRange({ low, high, initialFee, compact = false }: InvestmentRangeProps) {
  const notDisclosed = low === 0 && high === 0;

  if (compact) {
    return (
      <span className={`text-sm font-medium ${notDisclosed ? "text-muted italic" : "text-foreground"}`}>
        {notDisclosed ? "Investment not disclosed" : `${formatCurrency(low)} \u2013 ${formatCurrency(high)}`}
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className={`text-base font-semibold ${notDisclosed ? "text-muted italic" : "text-foreground"}`}>
        {notDisclosed ? "Investment not disclosed" : `${formatCurrency(low)} \u2013 ${formatCurrency(high)}`}
      </span>
      {!notDisclosed && initialFee !== undefined && initialFee > 0 && (
        <span className="text-xs text-muted">
          Initial franchise fee: {formatCurrency(initialFee)}
        </span>
      )}
    </div>
  );
}
