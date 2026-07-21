import type { DispatchState } from "./types";

const now = new Date("2026-07-18T15:30:00.000Z");
const minutesAgo = (minutes: number) => new Date(now.getTime() - minutes * 60_000).toISOString();

export const demoDispatchState: DispatchState = {
  drivers: [
    {
      id: "drv-ana",
      name: "Jordan Miles",
      phone: "555-0101",
      status: "available",
      current_assignment_id: null,
      created_at: minutesAgo(420),
      updated_at: minutesAgo(15)
    },
    {
      id: "drv-diana",
      name: "Casey Rivera",
      phone: "555-0102",
      status: "assigned",
      current_assignment_id: "req-active-1",
      created_at: minutesAgo(420),
      updated_at: minutesAgo(40)
    },
    {
      id: "drv-yazmin",
      name: "Morgan Lee",
      phone: "555-0103",
      status: "unavailable",
      current_assignment_id: null,
      created_at: minutesAgo(420),
      updated_at: minutesAgo(25)
    },
    {
      id: "drv-sam",
      name: "Taylor Chen",
      phone: "555-0104",
      status: "off_duty",
      current_assignment_id: null,
      created_at: minutesAgo(420),
      updated_at: minutesAgo(120)
    }
  ],
  serviceRequests: [
    {
      id: "req-active-1",
      customer_name: "Fictional Customer A",
      customer_phone: "555-0201",
      pickup_address: "100 Demo Way",
      destination_address: "200 Sample Ave",
      vehicle_description: "Blue sedan",
      service_type: "Tow",
      notes: "Demo active request assigned to a driver.",
      status: "active",
      assigned_driver_id: "drv-diana",
      created_at: minutesAgo(90),
      updated_at: minutesAgo(40),
      completed_at: null
    },
    {
      id: "req-unassigned-1",
      customer_name: "Fictional Customer B",
      customer_phone: "555-0202",
      pickup_address: "300 Placeholder Rd",
      destination_address: "",
      vehicle_description: "White SUV",
      service_type: "Roadside assistance",
      notes: "Demo unassigned request.",
      status: "pending",
      assigned_driver_id: null,
      created_at: minutesAgo(35),
      updated_at: minutesAgo(35),
      completed_at: null
    },
    {
      id: "req-completed-1",
      customer_name: "Fictional Customer C",
      customer_phone: "555-0203",
      pickup_address: "400 Example St",
      destination_address: "500 Mockingbird Ln",
      vehicle_description: "Gray hatchback",
      service_type: "Vehicle transport",
      notes: "Demo completed request.",
      status: "completed",
      assigned_driver_id: "drv-ana",
      created_at: minutesAgo(240),
      updated_at: minutesAgo(180),
      completed_at: minutesAgo(180)
    }
  ],
  activityLogs: [
    {
      id: "log-1",
      entity_type: "service_request",
      entity_id: "req-active-1",
      action: "request_created",
      details: "Demo request created.",
      created_at: minutesAgo(90)
    },
    {
      id: "log-2",
      entity_type: "service_request",
      entity_id: "req-active-1",
      action: "driver_assigned",
      details: "Casey Rivera assigned.",
      created_at: minutesAgo(45)
    },
    {
      id: "log-3",
      entity_type: "service_request",
      entity_id: "req-completed-1",
      action: "request_completed",
      details: "Demo request completed.",
      created_at: minutesAgo(180)
    }
  ]
};
