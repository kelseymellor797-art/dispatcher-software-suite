import { describe, expect, it } from "vitest";
import { demoDispatchState } from "./seed";
import {
  assignDriver,
  createServiceRequest,
  searchRequests,
  unassignDriver,
  updateDriverStatus,
  updateRequestStatus
} from "./workflows";

describe("dispatch workflows", () => {
  it("validates and creates a service request", () => {
    const next = createServiceRequest(demoDispatchState, {
      customer_name: "Test Customer",
      customer_phone: "555-1111",
      pickup_address: "1 Test St",
      destination_address: "",
      vehicle_description: "Black coupe",
      service_type: "Tow",
      notes: ""
    });

    expect(next.serviceRequests[0].customer_name).toBe("Test Customer");
    expect(next.serviceRequests[0].status).toBe("pending");
    expect(next.activityLogs[0].action).toBe("request_created");
  });

  it("rejects invalid service request input", () => {
    expect(() =>
      createServiceRequest(demoDispatchState, {
        customer_name: "",
        customer_phone: "",
        pickup_address: "",
        destination_address: "",
        vehicle_description: "",
        service_type: "Tow",
        notes: ""
      })
    ).toThrow();
  });

  it("assigns an available driver to a request", () => {
    const next = assignDriver(demoDispatchState, "req-unassigned-1", "drv-ana");
    const request = next.serviceRequests.find((item) => item.id === "req-unassigned-1");
    const driver = next.drivers.find((item) => item.id === "drv-ana");

    expect(request?.assigned_driver_id).toBe("drv-ana");
    expect(request?.status).toBe("active");
    expect(driver?.status).toBe("assigned");
    expect(driver?.current_assignment_id).toBe("req-unassigned-1");
  });

  it("prevents assigning an unavailable driver without override", () => {
    expect(() => assignDriver(demoDispatchState, "req-unassigned-1", "drv-yazmin")).toThrow("Driver is not available");
  });

  it("allows assigning an unavailable driver with explicit override", () => {
    const next = assignDriver(demoDispatchState, "req-unassigned-1", "drv-yazmin", { overrideUnavailable: true });
    const request = next.serviceRequests.find((item) => item.id === "req-unassigned-1");
    expect(request?.assigned_driver_id).toBe("drv-yazmin");
  });

  it("unassigns a driver and returns request to pending", () => {
    const next = unassignDriver(demoDispatchState, "req-active-1");
    const request = next.serviceRequests.find((item) => item.id === "req-active-1");
    const driver = next.drivers.find((item) => item.id === "drv-diana");

    expect(request?.assigned_driver_id).toBeNull();
    expect(request?.status).toBe("pending");
    expect(driver?.current_assignment_id).toBeNull();
  });

  it("completes a request and frees assigned driver", () => {
    const next = updateRequestStatus(demoDispatchState, "req-active-1", "completed");
    const request = next.serviceRequests.find((item) => item.id === "req-active-1");
    const driver = next.drivers.find((item) => item.id === "drv-diana");

    expect(request?.completed_at).toBeTruthy();
    expect(request?.status).toBe("completed");
    expect(driver?.current_assignment_id).toBeNull();
  });

  it("clears assignment when a driver is marked unavailable", () => {
    const next = updateDriverStatus(demoDispatchState, "drv-diana", "unavailable");
    const request = next.serviceRequests.find((item) => item.id === "req-active-1");
    const driver = next.drivers.find((item) => item.id === "drv-diana");

    expect(driver?.current_assignment_id).toBeNull();
    expect(request?.assigned_driver_id).toBeNull();
    expect(request?.status).toBe("pending");
  });

  it("searches request history by customer, vehicle, address, and status", () => {
    expect(searchRequests(demoDispatchState.serviceRequests, "white suv", "all")).toHaveLength(1);
    expect(searchRequests(demoDispatchState.serviceRequests, "example", "completed")).toHaveLength(1);
    expect(searchRequests(demoDispatchState.serviceRequests, "fictional", "active")).toHaveLength(1);
  });
});
