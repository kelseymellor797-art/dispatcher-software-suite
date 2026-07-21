"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type ThemePreference } from "./theme-provider";

const options: Array<{ value: ThemePreference; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { value: "light", label: "Light theme", icon: Sun },
  { value: "dark", label: "Dark theme", icon: Moon },
  { value: "system", label: "System theme", icon: Monitor }
];

export function ThemeSwitcher() {
  const { preference, setPreference } = useTheme();

  return (
    <div className="inline-flex rounded-lg border p-1" style={{ borderColor: "var(--border)", background: "var(--surface-muted)" }} role="group" aria-label="Theme">
      {options.map((option) => {
        const Icon = option.icon;
        const selected = preference === option.value;
        return (
          <button
            aria-label={option.label}
            aria-pressed={selected}
            className="focus-ring inline-flex h-8 w-8 items-center justify-center rounded-md transition"
            key={option.value}
            onClick={() => setPreference(option.value)}
            style={{
              background: selected ? "var(--primary)" : "transparent",
              color: selected ? "white" : "var(--muted-text)"
            }}
            title={option.label}
            type="button"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

