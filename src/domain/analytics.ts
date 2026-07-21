import type { DispatchState, ServiceRequest } from "./types";

const staleMinutes = 60;

export function getDispatchMetrics(state: DispatchState) {
  const activeRequests = state.serviceRequests.filter((request) => request.status !== "completed");
  const unassignedRequests = activeRequests.filter((request) => !request.assigned_driver_id);
  const availableDrivers = state.drivers.filter((driver) => driver.status === "available");
  const today = new Date().toDateString();
  const completedToday = state.serviceRequests.filter(
    (request) => request.completed_at && new Date(request.completed_at).toDateString() === today
  );
  const completedWithResponse = state.serviceRequests.filter((request) => request.completed_at);
  const averageResponseMinutes = completedWithResponse.length
    ? Math.round(
        completedWithResponse.reduce((total, request) => {
          const created = new Date(request.created_at).getTime();
          const completed = new Date(request.completed_at ?? request.updated_at).getTime();
          return total + Math.max(0, completed - created) / 60_000;
        }, 0) / completedWithResponse.length
      )
    : null;
  const now = Date.now();
  const staleActiveRequests = activeRequests.filter((request) => {
    const updated = new Date(request.updated_at).getTime();
    return Number.isFinite(updated) && now - updated > staleMinutes * 60_000;
  });
  const unavailableAssignedDrivers = state.drivers.filter(
    (driver) => driver.current_assignment_id && driver.status !== "assigned"
  );

  return {
    activeRequests,
    unassignedRequests,
    availableDrivers,
    completedToday,
    averageResponseMinutes,
    staleActiveRequests,
    unavailableAssignedDrivers
  };
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatDuration(minutes: number | null) {
  if (minutes === null) return "N/A";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

export function getRequestAgeMinutes(request: ServiceRequest) {
  return Math.max(0, Math.round((Date.now() - new Date(request.created_at).getTime()) / 60_000));
}

