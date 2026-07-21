export function PageHeader({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-2">
      <p className="eyebrow">{eyebrow}</p>
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-[2.625rem] font-bold leading-tight sm:text-5xl" style={{ color: "var(--foreground)" }}>
            {title}
          </h2>
          {description ? (
            <p className="mt-1 max-w-3xl text-sm" style={{ color: "var(--muted-text)" }}>
              {description}
            </p>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}
