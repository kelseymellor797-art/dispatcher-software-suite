"use client";

import Link from "next/link";
import { ArrowUpDown, ClipboardList, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { useDispatchState } from "@/components/dispatch-provider";
import { requestStatuses, type RequestStatus } from "@/domain/config";
import { formatDateTime } from "@/domain/analytics";
import { getDriverForRequest, searchRequests } from "@/domain/workflows";
import type { ServiceRequest } from "@/domain/types";

type SortKey = "created_at" | "updated_at" | "customer_name" | "status";
type SortDirection = "asc" | "desc";

function compareRequests(a: ServiceRequest, b: ServiceRequest, key: SortKey, direction: SortDirection) {
  const multiplier = direction === "asc" ? 1 : -1;
  return String(a[key]).localeCompare(String(b[key])) * multiplier;
}

export default function ServiceRequestsPage() {
  const { state } = useDispatchState();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<RequestStatus | "all">("all");
  const [driverId, setDriverId] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("updated_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filtered = useMemo(() => {
    return searchRequests(state.serviceRequests, query, status)
      .filter((request) => driverId === "all" || request.assigned_driver_id === driverId || (driverId === "unassigned" && !request.assigned_driver_id))
      .sort((a, b) => compareRequests(a, b, sortKey, sortDirection));
  }, [state.serviceRequests, query, status, driverId, sortKey, sortDirection]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Dispatches" title="Dispatch table" description="Search, filter, sort, and open existing service requests.">
        <Link className="btn-primary" href="/service-requests/new">
          <Plus className="h-4 w-4" aria-hidden="true" />
          Create dispatch
        </Link>
      </PageHeader>

      <section className="surface mb-5 grid gap-3 p-4 lg:grid-cols-[1fr_180px_220px]">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Search
          </span>
          <span className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4" style={{ color: "var(--muted-text)" }} aria-hidden="true" />
            <input
              className="field-control w-full pl-9"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Customer, phone, address, vehicle, notes"
              value={query}
            />
          </span>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Status
          </span>
          <select className="field-control" onChange={(event) => setStatus(event.target.value as RequestStatus | "all")} value={status}>
            <option value="all">All statuses</option>
            {requestStatuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Driver
          </span>
          <select className="field-control" onChange={(event) => setDriverId(event.target.value)} value={driverId}>
            <option value="all">All drivers</option>
            <option value="unassigned">Unassigned</option>
            {state.drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="surface overflow-hidden">
        <div className="hidden max-h-[calc(100vh-15rem)] overflow-auto lg:block">
          <table className="min-w-[76rem] text-left text-sm">
            <thead className="sticky top-0 z-10" style={{ background: "var(--surface-elevated)", boxShadow: "0 1px 0 var(--border)" }}>
              <tr>
                <SortableHeader label="Dispatch" sortKey="customer_name" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                <th className="px-5 py-3.5 font-semibold" style={{ color: "var(--muted-text)" }}>Pickup</th>
                <th className="px-5 py-3.5 font-semibold" style={{ color: "var(--muted-text)" }}>Destination</th>
                <th className="px-5 py-3.5 font-semibold" style={{ color: "var(--muted-text)" }}>Service</th>
                <th className="px-5 py-3.5 font-semibold" style={{ color: "var(--muted-text)" }}>Driver</th>
                <SortableHeader label="Status" sortKey="status" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                <SortableHeader label="Created" sortKey="created_at" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                <SortableHeader label="Updated" sortKey="updated_at" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                <th className="px-5 py-3.5 font-semibold" style={{ color: "var(--muted-text)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((request) => {
                const driver = getDriverForRequest(state.drivers, request);
                return (
                  <tr className="data-row transition duration-150" key={request.id}>
                    <td className="min-w-48 px-5 py-4">
                      <Link className="focus-ring rounded font-semibold hover:underline" href={`/service-requests/${request.id}`} style={{ color: "var(--foreground)" }}>
                        {request.customer_name}
                      </Link>
                      <p className="mt-0.5 whitespace-nowrap font-mono text-xs" style={{ color: "var(--muted-text)" }}>
                        {request.id}
                      </p>
                    </td>
                    <td className="min-w-40 max-w-[15rem] px-5 py-4" style={{ color: "var(--muted-text)" }}>{request.pickup_address}</td>
                    <td className="min-w-44 max-w-[15rem] px-5 py-4" style={{ color: "var(--muted-text)" }}>{request.destination_address || "Not provided"}</td>
                    <td className="px-5 py-4" style={{ color: "var(--foreground)" }}>{request.service_type}</td>
                    <td className="px-5 py-4" style={{ color: "var(--muted-text)" }}>{driver?.name ?? "Unassigned"}</td>
                    <td className="px-5 py-4"><StatusBadge kind="request" status={request.status} /></td>
                    <td className="min-w-32 px-5 py-4 tabular-nums" style={{ color: "var(--muted-text)" }}>{formatDateTime(request.created_at)}</td>
                    <td className="min-w-32 px-5 py-4 tabular-nums" style={{ color: "var(--muted-text)" }}>{formatDateTime(request.updated_at)}</td>
                    <td className="px-5 py-4">
                      <Link className="btn-secondary px-3 py-1.5" href={`/service-requests/${request.id}`}>
                        Open
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 p-3 lg:hidden">
          {filtered.map((request) => {
            const driver = getDriverForRequest(state.drivers, request);
            return (
              <Link className="focus-ring surface-muted block p-3" href={`/service-requests/${request.id}`} key={request.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold" style={{ color: "var(--foreground)" }}>{request.customer_name}</p>
                    <p className="text-xs font-mono" style={{ color: "var(--muted-text)" }}>{request.id}</p>
                  </div>
                  <StatusBadge kind="request" status={request.status} />
                </div>
                <dl className="mt-3 grid gap-2 text-sm">
                  <MobileInfo label="Pickup" value={request.pickup_address} />
                  <MobileInfo label="Destination" value={request.destination_address || "Not provided"} />
                  <MobileInfo label="Driver" value={driver?.name ?? "Unassigned"} />
                  <MobileInfo label="Updated" value={formatDateTime(request.updated_at)} />
                </dl>
              </Link>
            );
          })}
        </div>

        {!filtered.length ? (
          <div className="p-4">
            <EmptyState icon={ClipboardList} title="No dispatches match" description="Adjust search or filters to see existing service requests." />
          </div>
        ) : null}
      </section>
    </div>
  );
}

function SortableHeader({
  label,
  sortKey,
  activeKey,
  direction,
  onSort
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
}) {
  return (
    <th className="px-5 py-3.5">
      <button className="focus-ring inline-flex items-center gap-1 rounded text-sm font-semibold" onClick={() => onSort(sortKey)} type="button" style={{ color: "var(--muted-text)" }}>
        {label}
        <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
        {activeKey === sortKey ? <span className="sr-only">Sorted {direction}</span> : null}
      </button>
    </th>
  );
}

function MobileInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--muted-text)" }}>{label}</dt>
      <dd style={{ color: "var(--foreground)" }}>{value}</dd>
    </div>
  );
}
