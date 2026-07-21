import { getDriverStatusMeta, type DriverStatus, type RequestStatus } from "./config";
import { createServiceRequestSchema } from "./schema";
import type { ActivityLog, CreateServiceRequestInput, DispatchState, Driver, ServiceRequest } from "./types";

const cloneState = (state: DispatchState): DispatchState => ({
  serviceRequests: state.serviceRequests.map((request) => ({ ...request })),
  drivers: state.drivers.map((driver) => ({ ...driver })),
  activityLogs: state.activityLogs.map((log) => ({ ...log }))
});

const createId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;
const timestamp = () => new Date().toISOString();

function log(state: DispatchState, entity_type: ActivityLog["entity_type"], entity_id: string, action: string, details: string) {
  state.activityLogs.unshift({
    id: createId("log"),
    entity_type,
    entity_id,
    action,
    details,
    created_at: timestamp()
  });
}

function findRequest(state: DispatchState, requestId: string) {
  const request = state.serviceRequests.find((item) => item.id === requestId);
  if (!request) throw new Error("Service request was not found.");
  return request;
}

function findDriver(state: DispatchState, driverId: string) {
  const driver = state.drivers.find((item) => item.id === driverId);
  if (!driver) throw new Error("Driver was not found.");
  return driver;
}

export function createServiceRequest(state: DispatchState, input: CreateServiceRequestInput): DispatchState {
  const parsed = createServiceRequestSchema.parse(input);
  const next = cloneState(state);
  const now = timestamp();
  const request: ServiceRequest = {
    id: createId("req"),
    ...parsed,
    status: "pending",
    assigned_driver_id: null,
    created_at: now,
    updated_at: now,
    completed_at: null
  };
  next.serviceRequests.unshift(request);
  log(next, "service_request", request.id, "request_created", `Created request for ${request.customer_name}.`);
  return next;
}

export function assignDriver(state: DispatchState, requestId: string, driverId: string, options?: { overrideUnavailable?: boolean }) {
  const next = cloneState(state);
  const request = findRequest(next, requestId);
  const driver = findDriver(next, driverId);
  const assignable = getDriverStatusMeta(driver.status).assignable;
  if (!assignable && !options?.overrideUnavailable) {
    throw new Error("Driver is not available. Confirm override to assign anyway.");
  }

  if (request.assigned_driver_id && request.assigned_driver_id !== driverId) {
    const previous = findDriver(next, request.assigned_driver_id);
    previous.current_assignment_id = null;
    if (previous.status === "assigned") previous.status = "available";
    previous.updated_at = timestamp();
  }

  request.assigned_driver_id = driver.id;
  request.status = request.status === "completed" ? "completed" : "active";
  request.updated_at = timestamp();
  driver.current_assignment_id = request.id;
  driver.status = "assigned";
  driver.updated_at = timestamp();
  log(next, "service_request", request.id, "driver_assigned", `${driver.name} assigned to request.`);
  return next;
}

export function unassignDriver(state: DispatchState, requestId: string) {
  const next = cloneState(state);
  const request = findRequest(next, requestId);
  if (!request.assigned_driver_id) return next;
  const driver = findDriver(next, request.assigned_driver_id);
  request.assigned_driver_id = null;
  request.status = request.status === "completed" ? "completed" : "pending";
  request.updated_at = timestamp();
  driver.current_assignment_id = null;
  if (driver.status === "assigned") driver.status = "available";
  driver.updated_at = timestamp();
  log(next, "service_request", request.id, "driver_unassigned", `${driver.name} unassigned from request.`);
  return next;
}

export function updateRequestStatus(state: DispatchState, requestId: string, status: RequestStatus) {
  const next = cloneState(state);
  const request = findRequest(next, requestId);
  const previous = request.status;
  request.status = status;
  request.updated_at = timestamp();
  request.completed_at = status === "completed" ? timestamp() : null;
  if (status === "completed" && request.assigned_driver_id) {
    const driver = findDriver(next, request.assigned_driver_id);
    driver.current_assignment_id = null;
    if (driver.status === "assigned") driver.status = "available";
    driver.updated_at = timestamp();
  }
  log(next, "service_request", request.id, status === "completed" ? "request_completed" : "request_status_updated", `${previous} -> ${status}`);
  return next;
}

export function updateDriverStatus(state: DispatchState, driverId: string, status: DriverStatus) {
  const next = cloneState(state);
  const driver = findDriver(next, driverId);
  const previous = driver.status;
  driver.status = status;
  driver.updated_at = timestamp();
  if (status !== "assigned" && driver.current_assignment_id) {
    const request = findRequest(next, driver.current_assignment_id);
    request.assigned_driver_id = null;
    request.status = request.status === "completed" ? "completed" : "pending";
    request.updated_at = timestamp();
    driver.current_assignment_id = null;
  }
  log(next, "driver", driver.id, "driver_status_updated", `${driver.name}: ${previous} -> ${status}`);
  return next;
}

export function searchRequests(requests: ServiceRequest[], query: string, status?: RequestStatus | "all") {
  const normalized = query.trim().toLowerCase();
  return requests.filter((request) => {
    const statusMatches = !status || status === "all" || request.status === status;
    const queryMatches =
      !normalized ||
      [
        request.customer_name,
        request.customer_phone,
        request.pickup_address,
        request.destination_address,
        request.vehicle_description,
        request.service_type,
        request.notes
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    return statusMatches && queryMatches;
  });
}

export function getDriverForRequest(drivers: Driver[], request: ServiceRequest) {
  return drivers.find((driver) => driver.id === request.assigned_driver_id) ?? null;
}
