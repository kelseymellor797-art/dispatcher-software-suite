# Architecture Overview

## Current Application

Dispatcher Software Suite is a Next.js App Router application for towing dispatch workflows.

Current routes:

- `/` - operations dashboard with KPIs, workload, charts, attention items, available drivers, and activity feed.
- `/service-requests` - dispatch table with search, status filter, driver filter, sorting, desktop table, and mobile cards.
- `/service-requests/new` - create dispatch form using React Hook Form and Zod validation.
- `/service-requests/[id]` - dispatch detail, assignment controls, override, unassign, status updates, and activity history.
- `/drivers` - driver roster and status management.
- `/activity` - activity timeline.
- `/reports` - aggregate reports from existing dispatch state.
- `/settings` - theme preference and demo data reset.

## Runtime Structure

```text
src/app
  App Router pages and global layout
src/components
  application shell, theme system, dashboard cards, badges, charts, timeline, request cards
src/domain
  business types, Zod schemas, workflow functions, analytics helpers, demo seed data
src/lib
  environment validation and Supabase client factories
src/test
  Vitest setup
scripts
  demo data export script
docs
  architecture, roadmap, ADRs, and operational documentation
```

## Current State and Data Flow

The app currently uses `DispatchProvider` as the data boundary:

1. `DispatchProvider` loads `demoDispatchState` or localStorage.
2. UI pages call provider actions such as `createRequest`, `assign`, `unassign`, `setRequestStatus`, and `setDriverStatus`.
3. Provider actions call pure workflow functions in `src/domain/workflows.ts`.
4. Workflow functions clone and mutate the dispatch state, validate input with Zod, and append activity logs.
5. Provider writes the next state to localStorage.

This creates a useful separation: core workflow behavior is mostly independent from React and can be preserved while adding Supabase persistence.

## Domain Model

Current TypeScript entities:

- `ServiceRequest`
  - customer name and phone
  - pickup and destination address
  - vehicle description
  - service type
  - notes
  - status: `pending`, `active`, `completed`
  - assigned driver id
  - created, updated, completed timestamps
- `Driver`
  - name
  - phone
  - status: `available`, `assigned`, `unavailable`, `off_duty`
  - current assignment id
  - created and updated timestamps
- `ActivityLog`
  - entity type
  - entity id
  - action
  - details
  - created timestamp

Current workflow rules:

- New dispatches start as `pending`.
- Assigning an available driver makes the request `active`, sets driver status to `assigned`, and records activity.
- Assigning an unavailable/off-duty/assigned driver requires explicit override.
- Reassignment clears the previous driver's current assignment.
- Unassignment returns non-completed requests to `pending`.
- Completing a request sets `completed_at`, records activity, and frees the assigned driver.
- Changing an assigned driver away from `assigned` clears the request assignment.

## UI Architecture

The UI uses a shared shell:

- `AppShell`
- compact responsive sidebar
- sticky top header
- theme switcher
- operational status summary
- persistent sidebar collapse preference

Theme architecture:

- CSS variables in `src/app/globals.css`.
- `html.dark` class for dark theme tokens.
- `ThemeScript` applies the stored preference before hydration.
- `ThemeProvider` supports `light`, `dark`, and `system`.
- Preference is stored in localStorage key `dispatcher-suite-theme`.

## Supabase Integration Status

Implemented:

- `src/lib/env.ts` validates public Supabase env vars and demo mode.
- `src/lib/supabase/client.ts` creates a browser client with `@supabase/ssr`.
- `src/lib/supabase/server.ts` creates a server client with cookie support.
- ADR 0001 documents the Supabase SSR foundation.

Not yet implemented:

- Supabase project linkage.
- `supabase/config.toml`.
- migrations.
- database types.
- authentication UI or session middleware.
- protected routes.
- production repositories.
- RLS policies.
- realtime subscriptions.
- storage, functions, or edge workers.

## Testing Architecture

Current automated tests:

- `src/domain/workflows.test.ts`
  - create request
  - validation failure
  - assignment
  - unavailable override
  - unassignment
  - completion
  - clearing assignment when driver becomes unavailable
  - search
- `src/lib/env.test.ts`
  - demo mode without Supabase credentials
  - configured Supabase project detection
  - legacy anon key fallback
  - production mode credential enforcement
  - invalid URL rejection

Validation scripts:

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run seed`

## Target Production Architecture

Planned layers:

```text
Browser UI
  Next.js client/server components
  protected routes
  realtime subscriptions
  map and dispatch workflows

Next.js server boundary
  Supabase SSR session handling
  server actions or route handlers for privileged operations
  validation and authorization checks
  Sentry instrumentation

Supabase
  Postgres tables
  Auth users
  profiles and roles
  RLS policies
  Realtime publications
  migrations and typed database contract

Traccar integration
  persistent Traccar server
  authenticated webhook, scheduled sync, or worker
  ingestion validation and audit logs

Location services
  real latest position
  position history
  map display
  optional routing/ETA provider
```

## Recommended Next Architecture Change

Add a persistence boundary before replacing localStorage. The current provider can depend on a repository interface with two implementations:

- demo repository backed by localStorage.
- Supabase repository backed by authenticated database access.

This reduces risk because the existing workflow tests can be reused against both implementations.
