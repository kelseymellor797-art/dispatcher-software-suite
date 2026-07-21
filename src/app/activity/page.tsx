"use client";

import { Route } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DashboardCard } from "@/components/dashboard-card";
import { ActivityTimeline } from "@/components/activity-timeline";
import { EmptyState } from "@/components/empty-state";
import { useDispatchState } from "@/components/dispatch-provider";

export default function ActivityPage() {
  const { state } = useDispatchState();

  return (
    <div>
      <PageHeader eyebrow="Activity" title="Workflow activity" description="A chronological log of dispatch and driver workflow changes." />
      <DashboardCard title="Activity timeline" description={`${state.activityLogs.length} recorded events`}>
        {state.activityLogs.length ? (
          <ActivityTimeline logs={state.activityLogs} />
        ) : (
          <EmptyState icon={Route} title="No activity recorded" description="Activity appears when dispatches or driver statuses change." />
        )}
      </DashboardCard>
    </div>
  );
}

