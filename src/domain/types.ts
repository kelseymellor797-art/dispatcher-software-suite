import type { DriverStatus, RequestStatus, ServiceType } from "./config";

export type EntityType = "service_request" | "driver";

export type ServiceRequest = {
  id: string;
  customer_name: string;
  customer_phone: string;
  pickup_address: string;
  destination_address: string;
  vehicle_description: string;
  service_type: ServiceType;
  notes: string;
  status: RequestStatus;
  assigned_driver_id: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
};

export type Driver = {
  id: string;
  name: string;
  phone: string;
  status: DriverStatus;
  current_assignment_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ActivityLog = {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  action: string;
  details: string;
  created_at: string;
};

export type DispatchState = {
  serviceRequests: ServiceRequest[];
  drivers: Driver[];
  activityLogs: ActivityLog[];
};

export type CreateServiceRequestInput = Pick<
  ServiceRequest,
  | "customer_name"
  | "customer_phone"
  | "pickup_address"
  | "destination_address"
  | "vehicle_description"
  | "service_type"
  | "notes"
>;
