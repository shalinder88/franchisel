/**
 * UnitGrowthChart — SVG bar chart showing net unit growth by year.
 * Pure SVG, no external dependencies.
 */

interface YearData {
  year: number;
  net: number;
  opened?: number;
  closed?: number;
}

interface UnitGrowthChartProps {
  data: YearData[];
  height?: number;
}

export default function UnitGrowthChart({ data, height = 64 }: UnitGrowthChartProps) {
  if (!data || data.length === 0) return null;

  const barWidth = 28;
  const gap = 8;
  const labelHeight = 18;
  const chartHeight = height - labelHeight;
  const totalWidth = data.length * (barWidth + gap) - gap;

  const maxAbs = Math.max(...data.map((d) => Math.abs(d.net)), 1);

  return (
    <svg
      width={totalWidth}
      height={height}
      viewBox={`0 0 ${totalWidth} ${height}`}
      className="overflow-visible"
      aria-label="Unit growth by year"
    >
      {/* Zero baseline */}
      <line
        x1={0}
        y1={chartHeight / 2}
        x2={totalWidth}
        y2={chartHeight / 2}
        stroke="currentColor"
        strokeOpacity={0.15}
        strokeWidth={1}
      />

      {data.map((d, i) => {
        const x = i * (barWidth + gap);
        const barH = Math.max(2, (Math.abs(d.net) / maxAbs) * (chartHeight / 2 - 4));
        const isPositive = d.net >= 0;
        const barY = isPositive
          ? chartHeight / 2 - barH
          : chartHeight / 2;

        const color = d.net > 0
          ? "#22c55e"   // green
          : d.net < 0
          ? "#ef4444"   // red
          : "#6b7280";  // grey (zero)

        return (
          <g key={d.year}>
            <rect
              x={x}
              y={barY}
              width={barWidth}
              height={barH}
              rx={3}
              fill={color}
              fillOpacity={0.85}
            />
            {/* Net value label inside/above bar */}
            <text
              x={x + barWidth / 2}
              y={isPositive ? barY - 3 : barY + barH + 11}
              textAnchor="middle"
              fontSize={9}
              fill={color}
              fontWeight="600"
            >
              {d.net > 0 ? `+${d.net}` : d.net}
            </text>
            {/* Year label */}
            <text
              x={x + barWidth / 2}
              y={height - 2}
              textAnchor="middle"
              fontSize={9}
              fill="currentColor"
              opacity={0.5}
            >
              {d.year}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
