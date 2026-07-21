import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="surface-muted flex flex-col items-center justify-center px-4 py-8 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "var(--selected-row)", color: "var(--primary)" }}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-3 text-sm font-semibold" style={{ color: "var(--foreground)" }}>
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-sm" style={{ color: "var(--muted-text)" }}>
        {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

