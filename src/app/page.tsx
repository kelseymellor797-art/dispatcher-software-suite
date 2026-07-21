"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock3, ClipboardList, PhoneCall, Plus, Radio, Route, Truck, UserCheck, UserRoundCog } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { RequestCard } from "@/components/request-card";
import { StatusBadge } from "@/components/status-badge";
import { useDispatchState } from "@/components/dispatch-provider";
import { getDriverForRequest } from "@/domain/workflows";
import { getDispatchMetrics, formatDuration, formatDateTime } from "@/domain/analytics";
import { MetricCard } from "@/components/metric-card";
import { DashboardCard } from "@/components/dashboard-card";
import { BarList, StatusDonut } from "@/components/operations-charts";
import { EmptyState } from "@/components/empty-state";
import type { ActivityLog } from "@/domain/types";

export default function DashboardPage() {
  const { state, resetDemoData } = useDispatchState();
  const metrics = getDispatchMetrics(state);
  const requestStatusItems = [
    { label: "Pending", value: state.serviceRequests.filter((request) => request.status === "pending").length, color: "var(--chart-5)" },
    { label: "Active", value: state.serviceRequests.filter((request) => request.status === "active").length, color: "var(--chart-1)" },
    { label: "Completed", value: state.serviceRequests.filter((request) => request.status === "completed").length, color: "var(--chart-4)" }
  ];
  const driverStatusItems = [
    { label: "Available", value: state.drivers.filter((driver) => driver.status === "available").length, color: "var(--chart-4)" },
    { label: "Assigned", value: state.drivers.filter((driver) => driver.status === "assigned").length, color: "var(--chart-2)" },
    { label: "Unavailable", value: state.drivers.filter((driver) => driver.status === "unavailable").length, color: "var(--chart-5)" },
    { label: "Off duty", value: state.drivers.filter((driver) => driver.status === "off_duty").length, color: "var(--chart-6)" }
  ];
  const serviceItems = ["Tow", "Roadside assistance", "Vehicle transport", "Other"].map((service, index) => ({
    label: service,
    value: state.serviceRequests.filter((request) => request.service_type === service).length,
    color: `var(--chart-${index + 1})`
  }));
  const attentionRequests = [...metrics.unassignedRequests, ...metrics.staleActiveRequests.filter((request) => request.assigned_driver_id)].slice(0, 5);

  return (
    <div>
      <PageHeader
        eyebrow="Command center"
        title="Active dispatch board"
        description="Monitor live dispatch load, assignment coverage, and operational activity from real demo data."
      >
        <div className="flex flex-wrap gap-2">
          <Link className="btn-primary" href="/service-requests/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create dispatch
          </Link>
          <button className="btn-secondary" onClick={resetDemoData} type="button">
            Reset demo data
          </button>
        </div>
      </PageHeader>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5" aria-label="Dispatch summary">
        <MetricCard label="Active dispatches" value={metrics.activeRequests.length} supporting="Pending or in progress" icon={ClipboardList} />
        <MetricCard label="Unassigned" value={metrics.unassignedRequests.length} supporting="Needs dispatcher action" icon={AlertTriangle} />
        <MetricCard label="Available drivers" value={metrics.availableDrivers.length} supporting={`${state.drivers.length} total drivers`} icon={UserCheck} />
        <MetricCard label="Completed today" value={metrics.completedToday.length} supporting="Based on completion time" icon={CheckCircle2} />
        <MetricCard label="Avg response" value={formatDuration(metrics.averageResponseMinutes)} supporting="Created to completed" icon={Clock3} />
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(24rem,0.65fr)]">
        <DashboardCard
          title="Current dispatch workload"
          description="Open records sorted by newest activity."
          action={
            <Link className="text-sm font-semibold hover:underline" href="/service-requests" style={{ color: "var(--primary)" }}>
              View all
            </Link>
          }
        >
          <div className="grid gap-3">
            {metrics.activeRequests.length ? (
              metrics.activeRequests
                .slice()
                .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
                .map((request) => <RequestCard driver={getDriverForRequest(state.drivers, request)} key={request.id} request={request} compact />)
            ) : (
              <EmptyState icon={ClipboardList} title="No active dispatches" description="New dispatches will appear here as soon as they are created." />
            )}
          </div>
        </DashboardCard>

        <div className="grid gap-6">
          <DashboardCard title="Operational attention" description="Records most likely to need dispatcher follow-up.">
            {attentionRequests.length ? (
              <div className="space-y-3">
                {attentionRequests.map((request) => (
                  <Link
                    className="focus-ring surface-muted block p-3 transition hover:-translate-y-0.5"
                    href={`/service-requests/${request.id}`}
                    key={request.id}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                        {request.customer_name}
                      </p>
                      <StatusBadge kind="request" status={request.status} />
                    </div>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted-text)" }}>
                      {!request.assigned_driver_id ? "Unassigned" : `Last updated ${formatDateTime(request.updated_at)}`}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState icon={CheckCircle2} title="No attention items" description="Every active dispatch has current assignment coverage." />
            )}
          </DashboardCard>

          <DashboardCard title="Available drivers" description="Assignable drivers visible to dispatch.">
            <div className="space-y-3">
              {metrics.availableDrivers.length ? (
                metrics.availableDrivers.map((driver) => (
                  <div className="surface-muted p-3" key={driver.id}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold" style={{ color: "var(--foreground)" }}>
                        {driver.name}
                      </p>
                      <StatusBadge kind="driver" status={driver.status} />
                    </div>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted-text)" }}>
                      {driver.phone}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyState icon={Truck} title="No available drivers" description="Update driver status to make drivers assignable." />
              )}
            </div>
          </DashboardCard>
        </div>
      </section>

      <section className="mt-7 grid gap-6 xl:grid-cols-3">
        <DashboardCard title="Dispatch status mix" description="All current and completed records.">
          <StatusDonut items={requestStatusItems} label="Dispatches by status" />
        </DashboardCard>
        <DashboardCard title="Driver status mix" description="Current availability distribution.">
          <StatusDonut items={driverStatusItems} label="Drivers by status" />
        </DashboardCard>
        <DashboardCard title="Service type volume" description="Requests grouped by service type.">
          <BarList items={serviceItems} label="Requests by service type" />
        </DashboardCard>
      </section>

      <section className="mt-7">
        <DashboardCard
          title="Live dispatch feed"
          description="Real workflow events from the current dispatch session."
          action={
            <span className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-bold status-primary">
              <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
              Live
            </span>
          }
        >
          <LiveDispatchFeed logs={state.activityLogs.slice(0, 8)} />
        </DashboardCard>
      </section>
    </div>
  );
}

function getFeedIcon(action: string) {
  if (action.includes("created")) return PhoneCall;
  if (action.includes("assigned")) return Truck;
  if (action.includes("completed")) return CheckCircle2;
  if (action.includes("driver")) return UserRoundCog;
  return Route;
}

function LiveDispatchFeed({ logs }: { logs: ActivityLog[] }) {
  if (!logs.length) {
    return <EmptyState icon={Radio} title="No live events" description="Dispatch events will stream here as records change." />;
  }

  return (
    <ol className="divide-y" style={{ borderColor: "var(--border-subtle)" }} aria-label="Live dispatch feed">
      {logs.map((log) => {
        const Icon = getFeedIcon(log.action);
        return (
          <li className="group grid grid-cols-[2.5rem_1fr] gap-3 py-3 first:pt-0 last:pb-0" key={log.id}>
            <span
              className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl transition duration-150 group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, color-mix(in srgb, var(--primary) 24%, var(--surface)), color-mix(in srgb, var(--secondary) 18%, var(--surface)))",
                color: "var(--primary)"
              }}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="truncate font-semibold capitalize" style={{ color: "var(--foreground)" }}>
                  {log.action.replaceAll("_", " ")}
                </p>
                <time className="font-mono text-xs tabular-nums" style={{ color: "var(--muted-text)" }}>
                  {formatDateTime(log.created_at)}
                </time>
              </div>
              <p className="mt-1 text-sm" style={{ color: "var(--muted-text)" }}>
                {log.details}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
