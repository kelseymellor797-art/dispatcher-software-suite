import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  supporting,
  icon: Icon
}: {
  label: string;
  value: string | number;
  supporting?: string;
  icon: LucideIcon;
}) {
  return (
    <article className="surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-text)" }}>
            {label}
          </p>
          <p className="mt-2 font-mono text-4xl font-bold leading-none tabular-nums sm:text-[2.75rem]" style={{ color: "var(--foreground)" }}>
            {value}
          </p>
        </div>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{
            background: "color-mix(in srgb, var(--primary) 14%, var(--surface-muted))",
            color: "var(--primary)"
          }}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      {supporting ? (
        <p className="mt-3 text-sm" style={{ color: "var(--muted-text)" }}>
          {supporting}
        </p>
      ) : null}
    </article>
  );
}
