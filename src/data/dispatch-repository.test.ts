import { describe, expect, it } from "vitest";
import { demoDispatchState } from "@/domain/seed";
import { createDemoDispatchRepository } from "./demo-dispatch-repository";

describe("demo dispatch repository", () => {
  it("preserves create request behavior", () => {
    const repository = createDemoDispatchRepository(demoDispatchState);
    const next = repository.createRequest({
      customer_name: "Repository Test Customer",
      customer_phone: "555-0401",
      pickup_address: "1 Repository Way",
      destination_address: "",
      vehicle_description: "Black coupe",
      service_type: "Tow",
      notes: ""
    });

    expect(next.serviceRequests[0].customer_name).toBe("Repository Test Customer");
    expect(next.serviceRequests[0].status).toBe("pending");
    expect(next.activityLogs[0].action).toBe("request_created");
  });

  it("preserves assignment and unavailable override behavior", () => {
    const repository = createDemoDispatchRepository(demoDispatchState);

    expect(() => repository.assignDriver("req-unassigned-1", "drv-yazmin")).toThrow("Driver is not available");

    const next = repository.assignDriver("req-unassigned-1", "drv-yazmin", {
      overrideUnavailable: true,
      overrideReason: "Fictional local test override reason"
    });

    const request = next.serviceRequests.find((item) => item.id === "req-unassigned-1");
    expect(request?.assigned_driver_id).toBe("drv-yazmin");
    expect(request?.status).toBe("active");
  });

  it("returns cloned state snapshots", () => {
    const repository = createDemoDispatchRepository(demoDispatchState);
    const snapshot = repository.getState();
    snapshot.serviceRequests.length = 0;

    expect(repository.getState().serviceRequests).toHaveLength(demoDispatchState.serviceRequests.length);
  });
});

