"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, FileText, MapPin, Phone, Truck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DashboardCard } from "@/components/dashboard-card";
import { useDispatchState } from "@/components/dispatch-provider";
import { serviceTypes } from "@/domain/config";
import { createServiceRequestSchema, type CreateServiceRequestFormValues } from "@/domain/schema";

export default function NewServiceRequestPage() {
  const router = useRouter();
  const { createRequest } = useDispatchState();
  const [message, setMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CreateServiceRequestFormValues>({
    resolver: zodResolver(createServiceRequestSchema),
    defaultValues: {
      customer_name: "",
      customer_phone: "",
      pickup_address: "",
      destination_address: "",
      vehicle_description: "",
      service_type: "Tow",
      notes: ""
    }
  });

  const onSubmit = handleSubmit((values) => {
    createRequest(createServiceRequestSchema.parse(values));
    setMessage("Service request created.");
    router.push("/service-requests");
  });

  return (
    <div>
      <PageHeader eyebrow="New dispatch" title="Create service dispatch" description="Capture customer, vehicle, location, service, and notes in a standardized record." />
      <form className="grid gap-5" onSubmit={onSubmit}>
        {message ? (
          <p className="rounded-lg border px-3 py-2 text-sm font-semibold status-success">
            <CheckCircle2 className="mr-2 inline h-4 w-4" aria-hidden="true" />
            {message}
          </p>
        ) : null}

        <DashboardCard title="Customer information" description="Required contact details for follow-up.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Customer name" required error={errors.customer_name?.message}>
              <input className="field-control" {...register("customer_name")} />
            </Field>
            <Field label="Customer phone" required error={errors.customer_phone?.message} helpText="Use the best callback number for dispatch updates.">
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-2.5 h-4 w-4" style={{ color: "var(--muted-text)" }} aria-hidden="true" />
                <input className="field-control w-full pl-9" {...register("customer_phone")} />
              </div>
            </Field>
          </div>
        </DashboardCard>

        <DashboardCard title="Pickup and destination" description="Destination may be omitted when it is not yet known.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Pickup address" required error={errors.pickup_address?.message}>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-2.5 h-4 w-4" style={{ color: "var(--muted-text)" }} aria-hidden="true" />
                <input className="field-control w-full pl-9" {...register("pickup_address")} />
              </div>
            </Field>
            <Field label="Destination address" error={errors.destination_address?.message}>
              <input className="field-control" {...register("destination_address")} />
            </Field>
          </div>
        </DashboardCard>

        <DashboardCard title="Service details" description="Select the request type and vehicle description.">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Vehicle description" required error={errors.vehicle_description?.message}>
              <div className="relative">
                <Truck className="pointer-events-none absolute left-3 top-2.5 h-4 w-4" style={{ color: "var(--muted-text)" }} aria-hidden="true" />
                <input className="field-control w-full pl-9" {...register("vehicle_description")} />
              </div>
            </Field>
            <Field label="Service type" required error={errors.service_type?.message}>
              <select className="field-control" {...register("service_type")}>
                {serviceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </DashboardCard>

        <DashboardCard title="Notes" description="Optional instructions visible on the dispatch detail record.">
          <Field label="Dispatch notes" error={errors.notes?.message}>
            <div className="relative">
              <FileText className="pointer-events-none absolute left-3 top-3 h-4 w-4" style={{ color: "var(--muted-text)" }} aria-hidden="true" />
              <textarea className="field-control min-h-28 w-full pl-9" {...register("notes")} />
            </div>
          </Field>
        </DashboardCard>

        <div className="flex justify-end gap-2">
          <button className="btn-primary px-5 py-3" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Creating..." : "Create dispatch"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  helpText,
  children
}: {
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
        {label} {required ? <span style={{ color: "var(--danger)" }}>*</span> : null}
      </span>
      {children}
      {helpText ? <span className="text-xs" style={{ color: "var(--muted-text)" }}>{helpText}</span> : null}
      {error ? <span className="text-sm" style={{ color: "var(--danger)" }}>{error}</span> : null}
    </label>
  );
}

