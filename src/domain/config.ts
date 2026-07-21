export const requestStatuses = [
  { value: "pending", label: "Pending", active: true },
  { value: "active", label: "Active", active: true },
  { value: "completed", label: "Completed", active: false }
] as const;

export const driverStatuses = [
  { value: "available", label: "Available", assignable: true },
  { value: "assigned", label: "Assigned", assignable: false },
  { value: "unavailable", label: "Unavailable", assignable: false },
  { value: "off_duty", label: "Off duty", assignable: false }
] as const;

// Placeholder MVP values. Final towing service types and driver statuses are still TODOs in the planning document.
export const serviceTypes = [
  "Tow",
  "Roadside assistance",
  "Vehicle transport",
  "Other"
] as const;

export type RequestStatus = (typeof requestStatuses)[number]["value"];
export type DriverStatus = (typeof driverStatuses)[number]["value"];
export type ServiceType = (typeof serviceTypes)[number];

export function getDriverStatusMeta(status: DriverStatus) {
  return driverStatuses.find((item) => item.value === status) ?? driverStatuses[0];
}

export function getRequestStatusMeta(status: RequestStatus) {
  return requestStatuses.find((item) => item.value === status) ?? requestStatuses[0];
}
