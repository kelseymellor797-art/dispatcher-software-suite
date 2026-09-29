"use client";

import Link from "next/link";
import { Truck, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { DashboardCard } from "@/components/dashboard-card";
import { EmptyState } from "@/components/empty-state";
import { useDispatchState } from "@/components/dispatch-provider";
import { driverStatuses, type DriverStatus } from "@/domain/config";
import { formatDateTime } from "@/domain/analytics";

export default function DriversPage() {
  const { state, setDriverStatus } = useDispatchState();

  return (
    <div>
      <PageHeader eyebrow="Drivers" title="Driver availability" description="Review assignable drivers, current dispatches, and update availability states." />

      <DashboardCard title="Driver roster" description={`${state.drivers.length} drivers in the local demo roster.`}>
        {state.drivers.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {state.drivers.map((driver) => {
              const assignment = state.serviceRequests.find((request) => request.id === driver.current_assignment_id);
              return (
                <article className="surface-muted p-5 hover:-translate-y-0.5 hover:shadow-lg" key={driver.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-2xl font-bold leading-tight" style={{ color: "var(--foreground)" }}>{driver.name}</h3>
                      <p className="mt-1 text-sm font-semibold" style={{ color: "var(--muted-text)" }}>Tow Operator</p>
                    </div>
                    <StatusBadge kind="driver" status={driver.status} />
                  </div>

                  <dl className="mt-5 grid gap-4 border-t pt-4 text-sm" style={{ borderColor: "var(--border-subtle)" }}>
                    <Info label="Phone">{driver.phone}</Info>
                    <Info label="Current dispatch">
                      {assignment ? (
                        <Link className="focus-ring rounded font-semibold hover:underline" href={`/service-requests/${assignment.id}`} style={{ color: "var(--primary)" }}>
                          {assignment.customer_name}
                        </Link>
                      ) : (
                        <span>None</span>
                      )}
                    </Info>
                    <Info label="Last activity">{formatDateTime(driver.updated_at)}</Info>
                  </dl>

                  <label className="mt-4 flex flex-col gap-1" htmlFor={`driver-status-${driver.id}`}>
                    <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Update status</span>
                    <select
                      className="field-control"
                      id={`driver-status-${driver.id}`}
                      name={`driver-status-${driver.id}`}
                      onChange={(event) => setDriverStatus(driver.id, event.target.value as DriverStatus)}
                      value={driver.status}
                    >
                      {driverStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <p className="mt-3 rounded-lg border px-3 py-2 text-xs" style={{ borderColor: "var(--border-subtle)", color: "var(--muted-text)" }}>
                    Changing a driver away from assigned clears their current assignment so dispatch can reassign the request.
                  </p>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={Truck} title="No drivers available" description="Drivers will appear here when present in the dispatch state." />
        )}
      </DashboardCard>

      <section className="mt-5 grid gap-3 md:grid-cols-4">
        {driverStatuses.map((status) => (
          <div className="surface p-4" key={status.value}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: "var(--muted-text)" }}>{status.label}</p>
              <UserCheck className="h-4 w-4" style={{ color: "var(--primary)" }} aria-hidden="true" />
            </div>
            <p className="mt-2 font-mono text-3xl font-bold tabular-nums" style={{ color: "var(--foreground)" }}>
              {state.drivers.filter((driver) => driver.status === status.value).length}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-text)" }}>{label}</dt>
      <dd className="mt-1" style={{ color: "var(--foreground)" }}>{children}</dd>
    </div>
  );
}
