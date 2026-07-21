type ChartItem = {
  label: string;
  value: number;
  color: string;
};

export function StatusDonut({ items, label }: { items: ChartItem[]; label: string }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let offset = 25;
  const segments = items.map((item) => {
    const dash = total ? (item.value / total) * 100 : 0;
    const segment = { ...item, dash, offset };
    offset -= dash;
    return segment;
  });

  return (
    <div className="grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-center">
      <div className="relative mx-auto h-40 w-40" role="img" aria-label={label}>
        <svg className="-rotate-90" viewBox="0 0 42 42" aria-hidden="true">
          <circle cx="21" cy="21" fill="none" r="15.915" stroke="var(--surface-muted)" strokeWidth="5" />
          {segments.map((segment) => (
            <circle
              className="chart-segment"
              cx="21"
              cy="21"
              fill="none"
              key={segment.label}
              r="15.915"
              stroke={segment.color}
              strokeDasharray={`${segment.dash} ${100 - segment.dash}`}
              strokeDashoffset={segment.offset}
              strokeLinecap="round"
              strokeWidth="5"
            >
              <title>{`${segment.label}: ${segment.value}`}</title>
            </circle>
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-mono text-3xl font-bold tabular-nums" style={{ color: "var(--foreground)" }}>
            {total}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-text)" }}>
            Total
          </span>
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li className="flex items-center justify-between gap-3 text-sm" key={item.label}>
            <span className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
              <span className="truncate" style={{ color: "var(--muted-text)" }}>
                {item.label}
              </span>
            </span>
            <span className="font-mono font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BarList({ items, label }: { items: ChartItem[]; label: string }) {
  const max = Math.max(1, ...items.map((item) => item.value));

  return (
    <div className="space-y-3" role="img" aria-label={label}>
      {items.map((item) => (
        <div className="space-y-1" key={item.label}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span style={{ color: "var(--muted-text)" }}>{item.label}</span>
            <span className="font-mono font-semibold tabular-nums" style={{ color: "var(--foreground)" }}>
              {item.value}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full" style={{ background: "var(--surface-muted)" }}>
            <div
              className="progress-fill h-full rounded-full"
              style={{
                width: `${(item.value / max) * 100}%`,
                background: `linear-gradient(90deg, ${item.color}, color-mix(in srgb, ${item.color} 70%, var(--accent)))`
              }}
              title={`${item.label}: ${item.value}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
