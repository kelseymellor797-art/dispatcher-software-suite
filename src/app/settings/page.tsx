"use client";

import { RotateCcw, Settings } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DashboardCard } from "@/components/dashboard-card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useTheme } from "@/components/theme-provider";
import { useDispatchState } from "@/components/dispatch-provider";

export default function SettingsPage() {
  const { preference, resolvedTheme } = useTheme();
  const { resetDemoData } = useDispatchState();

  return (
    <div>
      <PageHeader eyebrow="Settings" title="Workspace settings" description="Theme preference and local demo state controls." />

      <div className="grid gap-5 xl:grid-cols-2">
        <DashboardCard title="Appearance" description="Choose light, dark, or system theme. Preference is saved on this device.">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Theme</p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted-text)" }}>
                Selected {preference}; currently rendering {resolvedTheme}.
              </p>
            </div>
            <ThemeSwitcher />
          </div>
        </DashboardCard>

        <DashboardCard title="Demo data" description="Restore the fictional local browser storage dataset.">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Settings className="mt-0.5 h-5 w-5" style={{ color: "var(--primary)" }} aria-hidden="true" />
              <p className="text-sm" style={{ color: "var(--muted-text)" }}>
                Resetting replaces local demo dispatches, drivers, and activity logs with the bundled sample state.
              </p>
            </div>
            <button className="btn-secondary" onClick={resetDemoData} type="button">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset demo data
            </button>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

