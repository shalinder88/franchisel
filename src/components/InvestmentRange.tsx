import { formatCurrency } from "@/lib/types";

interface InvestmentRangeProps {
  low: number;
  high: number;
  initialFee?: number;
  compact?: boolean;
}

export default function InvestmentRange({ low, high, initialFee, compact = false }: InvestmentRangeProps) {
  if (compact) {
    return (
      <span className="text-sm font-medium text-foreground">
        {formatCurrency(low)} &ndash; {formatCurrency(high)}
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-base font-semibold text-foreground">
        {formatCurrency(low)} &ndash; {formatCurrency(high)}
      </span>
      {initialFee !== undefined && (
        <span className="text-xs text-muted">
          Initial franchise fee: {formatCurrency(initialFee)}
        </span>
      )}
    </div>
  );
}
