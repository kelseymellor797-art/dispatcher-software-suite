import Link from "next/link";
import type { Driver, ServiceRequest } from "@/domain/types";
import { StatusBadge } from "./status-badge";

export function RequestCard({ request, driver, compact = false }: { request: ServiceRequest; driver: Driver | null; compact?: boolean }) {
  return (
    <article className="surface p-4 transition hover:-translate-y-0.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge kind="request" status={request.status} />
            {!driver && request.status !== "completed" ? (
              <span className="rounded-full px-2.5 py-1 text-xs font-bold status-warning">Unassigned</span>
            ) : null}
          </div>
          <h3 className="mt-3 text-lg font-semibold" style={{ color: "var(--foreground)" }}>{request.customer_name}</h3>
          <p className="text-sm muted-text">{request.vehicle_description}</p>
        </div>
        <Link className="btn-primary text-center" href={`/service-requests/${request.id}`}>
          Open
        </Link>
      </div>
      <dl className={`mt-4 grid gap-3 text-sm ${compact ? "md:grid-cols-4" : "sm:grid-cols-2"}`}>
        <div>
          <dt className="font-semibold" style={{ color: "var(--foreground)" }}>Pickup</dt>
          <dd className="muted-text line-clamp-2">{request.pickup_address}</dd>
        </div>
        <div>
          <dt className="font-semibold" style={{ color: "var(--foreground)" }}>Destination</dt>
          <dd className="muted-text line-clamp-2">{request.destination_address || "Not provided"}</dd>
        </div>
        <div>
          <dt className="font-semibold" style={{ color: "var(--foreground)" }}>Driver</dt>
          <dd className="muted-text">{driver?.name ?? "Unassigned"}</dd>
        </div>
        <div>
          <dt className="font-semibold" style={{ color: "var(--foreground)" }}>Service</dt>
          <dd className="muted-text">{request.service_type}</dd>
        </div>
      </dl>
    </article>
  );
}
