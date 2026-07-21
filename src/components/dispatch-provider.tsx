"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { demoDispatchState } from "@/domain/seed";
import type { CreateServiceRequestInput, DispatchState } from "@/domain/types";
import {
  assignDriver,
  createServiceRequest,
  searchRequests,
  unassignDriver,
  updateDriverStatus,
  updateRequestStatus
} from "@/domain/workflows";
import type { DriverStatus, RequestStatus } from "@/domain/config";

const storageKey = "dispatcher-suite-demo-state-v1";

type DispatchContextValue = {
  state: DispatchState;
  createRequest: (input: CreateServiceRequestInput) => void;
  assign: (requestId: string, driverId: string, overrideUnavailable?: boolean) => void;
  unassign: (requestId: string) => void;
  setRequestStatus: (requestId: string, status: RequestStatus) => void;
  setDriverStatus: (driverId: string, status: DriverStatus) => void;
  resetDemoData: () => void;
};

const DispatchContext = createContext<DispatchContextValue | null>(null);

function loadInitialState(): DispatchState {
  if (typeof window === "undefined") return demoDispatchState;
  const stored = window.localStorage.getItem(storageKey);
  if (!stored) return demoDispatchState;
  try {
    return JSON.parse(stored) as DispatchState;
  } catch {
    return demoDispatchState;
  }
}

export function DispatchProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DispatchState>(loadInitialState);

  const commit = (next: DispatchState) => {
    setState(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const value = useMemo<DispatchContextValue>(
    () => ({
      state,
      createRequest: (input) => commit(createServiceRequest(state, input)),
      assign: (requestId, driverId, overrideUnavailable) => commit(assignDriver(state, requestId, driverId, { overrideUnavailable })),
      unassign: (requestId) => commit(unassignDriver(state, requestId)),
      setRequestStatus: (requestId, status) => commit(updateRequestStatus(state, requestId, status)),
      setDriverStatus: (driverId, status) => commit(updateDriverStatus(state, driverId, status)),
      resetDemoData: () => commit(demoDispatchState)
    }),
    [state]
  );

  return <DispatchContext.Provider value={value}>{children}</DispatchContext.Provider>;
}

export function useDispatchState() {
  const context = useContext(DispatchContext);
  if (!context) throw new Error("useDispatchState must be used inside DispatchProvider.");
  return context;
}

export function useFilteredRequests(query: string, status: RequestStatus | "all") {
  const { state } = useDispatchState();
  return searchRequests(state.serviceRequests, query, status);
}
