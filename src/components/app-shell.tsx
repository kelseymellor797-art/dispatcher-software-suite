"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ClipboardList, Gauge, Menu, PanelLeftClose, PanelLeftOpen, Route, Settings, Truck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getDispatchMetrics } from "@/domain/analytics";
import { DispatchProvider, useDispatchState } from "./dispatch-provider";
import { ThemeProvider } from "./theme-provider";
import { ThemeSwitcher } from "./theme-switcher";

const collapseStorageKey = "dispatcher-suite-sidebar-collapsed";

const navItems = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/service-requests", label: "Dispatches", icon: ClipboardList },
  { href: "/drivers", label: "Drivers", icon: Truck },
  { href: "/activity", label: "Activity", icon: Route },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];

function getPageTitle(pathname: string) {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/service-requests/new")) return "New Dispatch";
  if (pathname.startsWith("/service-requests/") && pathname !== "/service-requests") return "Dispatch Detail";
  if (pathname.startsWith("/service-requests")) return "Dispatches";
  if (pathname.startsWith("/drivers")) return "Drivers";
  if (pathname.startsWith("/activity")) return "Activity";
  if (pathname.startsWith("/reports")) return "Reports";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Dispatcher Software Suite";
}

function Sidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between gap-3 border-b border-white/10 px-4">
        <Link className="focus-ring flex min-w-0 items-center gap-3 rounded-lg" href="/" onClick={onMobileClose}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-black text-white">
            DS
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold text-white">Dispatcher</span>
              <span className="block truncate text-xs" style={{ color: "var(--sidebar-muted)" }}>
                Operations Suite
              </span>
            </span>
          ) : null}
        </Link>
        <button className="focus-ring rounded-lg p-2 text-white lg:hidden" onClick={onMobileClose} type="button" aria-label="Close navigation">
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              aria-current={active ? "page" : undefined}
              className="focus-ring group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition"
              href={item.href}
              key={item.href}
              onClick={onMobileClose}
              style={{
                background: active ? "linear-gradient(135deg, rgba(124, 58, 237, 0.42), rgba(37, 99, 235, 0.24))" : "transparent",
                color: active ? "white" : "var(--sidebar-muted)",
                boxShadow: active ? "inset 3px 0 0 var(--primary)" : "none"
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {!collapsed ? <span>{item.label}</span> : <span className="sr-only">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="hidden border-t border-white/10 p-3 lg:block">
        <button
          className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition hover:bg-white/10"
          onClick={onToggle}
          style={{ color: "var(--sidebar-muted)" }}
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen className="h-5 w-5" aria-hidden="true" /> : <PanelLeftClose className="h-5 w-5" aria-hidden="true" />}
          {!collapsed ? <span>Collapse</span> : null}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="app-sidebar fixed inset-y-0 left-0 z-50 hidden w-[var(--sidebar-width)] lg:block">{content}</aside>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button className="absolute inset-0 cursor-default" style={{ background: "var(--overlay)" }} onClick={onMobileClose} type="button" aria-label="Close navigation" />
          <aside className="app-sidebar relative h-full w-72 shadow-2xl">{content}</aside>
        </div>
      ) : null}
    </>
  );
}

function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { state } = useDispatchState();
  const metrics = useMemo(() => getDispatchMetrics(state), [state]);

  return (
    <header className="topbar">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button className="btn-secondary px-3 lg:hidden" onClick={onMenuClick} type="button" aria-label="Open navigation">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-semibold" style={{ color: "var(--muted-text)" }}>
              Operations / {getPageTitle(pathname)}
            </p>
            <h1 className="truncate text-2xl font-bold sm:text-3xl" style={{ color: "var(--foreground)" }}>
              {getPageTitle(pathname)}
            </h1>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-3 rounded-xl border px-3 py-2 text-sm md:flex" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: metrics.unassignedRequests.length ? "var(--warning)" : "var(--success)" }} />
            <span style={{ color: "var(--muted-text)" }}>
              {metrics.unassignedRequests.length ? `${metrics.unassignedRequests.length} unassigned` : "Dispatch stable"}
            </span>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}

function ShellInner({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(collapseStorageKey) === "true");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(collapseStorageKey, String(next));
      return next;
    });
  };

  return (
    <div className="app-shell" data-collapsed={collapsed ? "true" : "false"}>
      <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="min-w-0 lg:col-start-2">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <main className="px-4 py-5 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <DispatchProvider>
        <ShellInner>{children}</ShellInner>
      </DispatchProvider>
    </ThemeProvider>
  );
}
