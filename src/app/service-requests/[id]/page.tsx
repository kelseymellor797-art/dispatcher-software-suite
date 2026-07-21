"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, TriangleAlert, UserMinus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { DashboardCard } from "@/components/dashboard-card";
import { ActivityTimeline } from "@/components/activity-timeline";
import { useDispatchState } from "@/components/dispatch-provider";
import { requestStatuses, type DriverStatus, type RequestStatus } from "@/domain/config";
import { formatDateTime } from "@/domain/analytics";

export default function ServiceRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const { state, assign, unassign, setRequestStatus } = useDispatchState();
  const [selectedDriver, setSelectedDriver] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const request = state.serviceRequests.find((item) => item.id === params.id);
  const assignedDriver = state.drivers.find((driver) => driver.id === request?.assigned_driver_id) ?? null;
  const activity = useMemo(
    () => state.activityLogs.filter((log) => log.entity_id === params.id).sort((a, b) => b.created_at.localeCompare(a.created_at)),
    [state.activityLogs, params.id]
  );

  if (!request) notFound();

  const assignSelectedDriver = (overrideUnavailable: boolean) => {
    if (!selectedDriver) {
      setError("Choose a driver before assigning.");
      return;
    }
    try {
      assign(request.id, selectedDriver, overrideUnavailable);
      setError("");
      setMessage("Driver assignment updated.");
    } catch (err) {
      setMessage("");
      setError(err instanceof Error ? err.message : "Unable to assign driver.");
    }
  };

  const updateStatus = (status: RequestStatus) => {
    setRequestStatus(request.id, status);
    setMessage(status === "completed" ? "Request completed." : "Request status updated.");
    setError("");
  };

  return (
    <div>
      <PageHeader eyebrow="Dispatch detail" title={request.customer_name} description={`Dispatch ${request.id}`}>
        <Link className="btn-secondary" href="/service-requests">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to dispatches
        </Link>
      </PageHeader>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <section className="space-y-5">
          {message ? (
            <p className="rounded-lg border px-3 py-2 text-sm font-semibold status-success">
              <CheckCircle2 className="mr-2 inline h-4 w-4" aria-hidden="true" />
              {message}
            </p>
          ) : null}
          {error ? (
            <p className="rounded-lg border px-3 py-2 text-sm font-semibold status-danger">
              <TriangleAlert className="mr-2 inline h-4 w-4" aria-hidden="true" />
              {error}
            </p>
          ) : null}

          <DashboardCard title="Dispatch record" description="Customer, service, location, and assignment details.">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge kind="request" status={request.status} />
              {assignedDriver ? <StatusBadge kind="driver" status={assignedDriver.status as DriverStatus} /> : null}
            </div>
            <dl className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Info label="Customer phone" value={request.customer_phone} />
              <Info label="Service type" value={request.service_type} />
              <Info label="Vehicle" value={request.vehicle_description} />
              <Info label="Assigned driver" value={assignedDriver?.name ?? "Unassigned"} />
              <Info label="Created" value={formatDateTime(request.created_at)} />
              <Info label="Updated" value={formatDateTime(request.updated_at)} />
              <Info label="Pickup" value={request.pickup_address} />
              <Info label="Destination" value={request.destination_address || "Not provided"} />
              <Info label="Completed" value={request.completed_at ? formatDateTime(request.completed_at) : "Not completed"} />
            </dl>
            <div className="mt-5">
              <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Notes</h3>
              <p className="surface-muted mt-1 p-3 text-sm" style={{ color: "var(--muted-text)" }}>
                {request.notes || "No notes recorded."}
              </p>
            </div>
          </DashboardCard>

          <DashboardCard title="Assignment controls" description="Assign, reassign, override unavailable drivers, or clear the current assignment.">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Driver</span>
                <select className="field-control" onChange={(event) => setSelectedDriver(event.target.value)} value={selectedDriver}>
                  <option value="">Select driver</option>
                  {state.drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} - {driver.status.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
              <button className="btn-primary self-end" onClick={() => assignSelectedDriver(false)} type="button">
                Assign
              </button>
              <button className="btn-warning self-end" onClick={() => assignSelectedDriver(true)} type="button">
                Override
              </button>
            </div>
            <button className="btn-secondary mt-3" onClick={() => unassign(request.id)} type="button">
              <UserMinus className="h-4 w-4" aria-hidden="true" />
              Unassign driver
            </button>
          </DashboardCard>

          <DashboardCard title="Status controls" description="Move the dispatch through the existing request lifecycle.">
            <div className="flex flex-wrap gap-2">
              {requestStatuses.map((status) => (
                <button
                  className="btn-secondary capitalize disabled:opacity-50"
                  disabled={request.status === status.value}
                  key={status.value}
                  onClick={() => updateStatus(status.value)}
                  type="button"
                >
                  {status.label}
                </button>
              ))}
            </div>
          </DashboardCard>
        </section>

        <DashboardCard title="Activity history" description="Workflow events for this dispatch.">
          <ActivityTimeline logs={activity} />
        </DashboardCard>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-text)" }}>
        {label}
      </dt>
      <dd className="mt-1 text-sm" style={{ color: "var(--foreground)" }}>
        {value}
      </dd>
    </div>
  );
}

