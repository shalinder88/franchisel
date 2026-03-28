interface ScoreBarProps {
  score: number;
  label?: string;
  weight?: string;
  size?: "sm" | "md" | "lg";
}

function getScoreColor(score: number): { bar: string; text: string } {
  if (score >= 8) return { bar: "bg-success", text: "text-success" };
  if (score >= 6) return { bar: "bg-accent", text: "text-accent" };
  if (score >= 4) return { bar: "bg-warning", text: "text-warning" };
  return { bar: "bg-danger", text: "text-danger" };
}

const sizeConfig = {
  sm: { height: "h-1.5", text: "text-xs", gap: "gap-1.5" },
  md: { height: "h-2.5", text: "text-sm", gap: "gap-2" },
  lg: { height: "h-3.5", text: "text-base", gap: "gap-2.5" },
} as const;

export default function ScoreBar({ score, label, weight, size = "md" }: ScoreBarProps) {
  const clamped = Math.max(0, Math.min(10, score));
  const pct = (clamped / 10) * 100;
  const color = getScoreColor(clamped);
  const cfg = sizeConfig[size];

  return (
    <div className={`flex flex-col ${cfg.gap}`}>
      {(label || weight) && (
        <div className="flex items-center justify-between">
          {label && <span className={`${cfg.text} font-medium text-foreground`}>{label}</span>}
          {weight && <span className="text-xs text-muted">{weight}</span>}
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className={`flex-1 ${cfg.height} rounded-full bg-surface overflow-hidden`}>
          <div
            className={`${cfg.height} rounded-full ${color.bar} animate-fill`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className={`${cfg.text} font-semibold tabular-nums ${color.text}`}>
          {clamped.toFixed(1)}
        </span>
      </div>
    </div>
  );
}
