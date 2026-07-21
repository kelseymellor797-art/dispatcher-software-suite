import Link from "next/link";
import { CheckCircle2, CircleDot, Route, UserRoundCog } from "lucide-react";
import { formatDateTime } from "@/domain/analytics";
import type { ActivityLog } from "@/domain/types";

function getIcon(action: string) {
  if (action.includes("completed")) return CheckCircle2;
  if (action.includes("driver")) return UserRoundCog;
  if (action.includes("request")) return Route;
  return CircleDot;
}

export function ActivityTimeline({ logs, compact = false }: { logs: ActivityLog[]; compact?: boolean }) {
  if (!logs.length) {
    return <p className="text-sm" style={{ color: "var(--muted-text)" }}>No activity recorded.</p>;
  }

  return (
    <ol className="space-y-3" aria-label="Activity timeline">
      {logs.map((log) => {
        const Icon = getIcon(log.action);
        const href = log.entity_type === "service_request" ? `/service-requests/${log.entity_id}` : "/drivers";
        return (
          <li className="grid grid-cols-[1.75rem_1fr] gap-3" key={log.id}>
            <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full" style={{ background: "var(--selected-row)", color: "var(--primary)" }}>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 border-b pb-3 last:border-0 last:pb-0" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link className="focus-ring rounded text-sm font-semibold capitalize hover:underline" href={href} style={{ color: "var(--foreground)" }}>
                  {log.action.replaceAll("_", " ")}
                </Link>
                <time className="text-xs tabular-nums" style={{ color: "var(--muted-text)" }}>
                  {formatDateTime(log.created_at)}
                </time>
              </div>
              <p className={`${compact ? "line-clamp-2" : ""} mt-1 text-sm`} style={{ color: "var(--muted-text)" }}>
                {log.details}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

