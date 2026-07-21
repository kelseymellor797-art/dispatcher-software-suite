"use client";

import { BarChart3, CheckCircle2, Clock3, ClipboardList, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DashboardCard } from "@/components/dashboard-card";
import { MetricCard } from "@/components/metric-card";
import { BarList, StatusDonut } from "@/components/operations-charts";
import { useDispatchState } from "@/components/dispatch-provider";
import { getDispatchMetrics, formatDuration } from "@/domain/analytics";

export default function ReportsPage() {
  const { state } = useDispatchState();
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

  return (
    <div>
      <PageHeader eyebrow="Reports" title="Operational reports" description="Aggregate dispatch and driver views generated from existing application records." />

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total dispatches" value={state.serviceRequests.length} supporting="All service requests" icon={ClipboardList} />
        <MetricCard label="Completed" value={state.serviceRequests.filter((request) => request.status === "completed").length} supporting="All-time completed records" icon={CheckCircle2} />
        <MetricCard label="Available drivers" value={metrics.availableDrivers.length} supporting={`${state.drivers.length} total drivers`} icon={UserCheck} />
        <MetricCard label="Avg response" value={formatDuration(metrics.averageResponseMinutes)} supporting="Completed requests only" icon={Clock3} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-3">
        <DashboardCard title="Dispatch status" description="Requests grouped by lifecycle state.">
          <StatusDonut items={requestStatusItems} label="Dispatches by status" />
        </DashboardCard>
        <DashboardCard title="Driver status" description="Drivers grouped by current availability.">
          <StatusDonut items={driverStatusItems} label="Drivers by status" />
        </DashboardCard>
        <DashboardCard title="Service volume" description="Service request volume by type.">
          <BarList items={serviceItems} label="Requests by service type" />
        </DashboardCard>
      </section>

      <DashboardCard className="mt-5" title="Report limitations" description="The MVP data model does not yet include revenue, priority, GPS, or SLA fields.">
        <div className="flex items-start gap-3 text-sm" style={{ color: "var(--muted-text)" }}>
          <BarChart3 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: "var(--primary)" }} aria-hidden="true" />
          <p>Reports are limited to real fields currently available in local dispatch state: statuses, assignments, timestamps, services, drivers, and activity logs.</p>
        </div>
      </DashboardCard>
    </div>
  );
}

