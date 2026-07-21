import { z } from "zod";
import { driverStatuses, requestStatuses, serviceTypes } from "./config";

export const createServiceRequestSchema = z.object({
  customer_name: z.string().trim().min(1, "Customer name is required"),
  customer_phone: z.string().trim().min(1, "Customer phone is required"),
  pickup_address: z.string().trim().min(1, "Pickup address is required"),
  destination_address: z.string().trim().optional().default(""),
  vehicle_description: z.string().trim().min(1, "Vehicle description is required"),
  service_type: z.enum(serviceTypes),
  notes: z.string().trim().optional().default("")
});

export const requestStatusSchema = z.enum(requestStatuses.map((item) => item.value) as [string, ...string[]]);
export const driverStatusSchema = z.enum(driverStatuses.map((item) => item.value) as [string, ...string[]]);

export type CreateServiceRequestFormValues = z.input<typeof createServiceRequestSchema>;
