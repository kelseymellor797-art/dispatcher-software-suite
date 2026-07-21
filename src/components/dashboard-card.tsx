export function DashboardCard({
  title,
  description,
  children,
  action,
  className = ""
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`surface ${className}`}>
      <div className="flex items-start justify-between gap-4 border-b px-4 py-3" style={{ borderColor: "var(--border-subtle)" }}>
        <div>
          <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {title}
          </h2>
          {description ? (
            <p className="mt-0.5 text-xs" style={{ color: "var(--muted-text)" }}>
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

