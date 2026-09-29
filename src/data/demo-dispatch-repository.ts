import { demoDispatchState } from "@/domain/seed";
import type { DriverStatus, RequestStatus } from "@/domain/config";
import type { CreateServiceRequestInput, DispatchState } from "@/domain/types";
import {
  assignDriver,
  createServiceRequest,
  unassignDriver,
  updateDriverStatus,
  updateRequestStatus
} from "@/domain/workflows";
import type { AssignDriverOptions, DispatchRepository } from "./dispatch-repository";

const cloneState = (state: DispatchState): DispatchState => ({
  serviceRequests: state.serviceRequests.map((request) => ({ ...request })),
  drivers: state.drivers.map((driver) => ({ ...driver })),
  activityLogs: state.activityLogs.map((log) => ({ ...log }))
});

export function createDemoDispatchRepository(initialState: DispatchState = demoDispatchState): DispatchRepository {
  let state = cloneState(initialState);

  const commit = (next: DispatchState) => {
    state = cloneState(next);
    return getState();
  };

  const getState = () => cloneState(state);

  return {
    getState,
    createRequest: (input: CreateServiceRequestInput) => commit(createServiceRequest(state, input)),
    assignDriver: (requestId: string, driverId: string, options?: AssignDriverOptions) =>
      commit(assignDriver(state, requestId, driverId, { overrideUnavailable: options?.overrideUnavailable })),
    unassignDriver: (requestId: string) => commit(unassignDriver(state, requestId)),
    updateRequestStatus: (requestId: string, status: RequestStatus) => commit(updateRequestStatus(state, requestId, status)),
    updateDriverStatus: (driverId: string, status: DriverStatus) => commit(updateDriverStatus(state, driverId, status)),
    reset: () => commit(demoDispatchState)
  };
}

