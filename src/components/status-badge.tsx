import type { DriverStatus, RequestStatus } from "@/domain/config";

const requestClasses: Record<RequestStatus, string> = {
  pending: "status-warning",
  active: "status-primary",
  completed: "status-success"
};

const driverClasses: Record<DriverStatus, string> = {
  available: "status-success",
  assigned: "status-info",
  unavailable: "status-warning",
  off_duty: "status-muted"
};

export function StatusBadge({ status, kind }: { status: RequestStatus | DriverStatus; kind: "request" | "driver" }) {
  const className = kind === "request" ? requestClasses[status as RequestStatus] : driverClasses[status as DriverStatus];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status.replace("_", " ")}
    </span>
  );
}
