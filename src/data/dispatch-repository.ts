import type { DriverStatus, RequestStatus } from "@/domain/config";
import type { CreateServiceRequestInput, DispatchState } from "@/domain/types";

export type AssignDriverOptions = {
  overrideUnavailable?: boolean;
  overrideReason?: string;
};

export type DispatchRepository = {
  getState: () => DispatchState;
  createRequest: (input: CreateServiceRequestInput) => DispatchState;
  assignDriver: (requestId: string, driverId: string, options?: AssignDriverOptions) => DispatchState;
  unassignDriver: (requestId: string) => DispatchState;
  updateRequestStatus: (requestId: string, status: RequestStatus) => DispatchState;
  updateDriverStatus: (driverId: string, status: DriverStatus) => DispatchState;
  reset?: () => DispatchState;
};

