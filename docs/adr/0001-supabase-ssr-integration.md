# ADR 0001: Supabase SSR Integration Foundation

## Status

Accepted

## Context

Sprint 2 replaces browser-only demo persistence with a real backend. The application already uses Next.js App Router and includes `@supabase/supabase-js`, but it did not yet have reusable Supabase client utilities or validated environment configuration.

Supabase's current Next.js guidance recommends `@supabase/ssr` for cookie-based server-side auth and separate browser/server client factories.

## Decision

Use `@supabase/ssr` with:

- A browser client factory in `src/lib/supabase/client.ts`
- A server client factory in `src/lib/supabase/server.ts`
- Centralized environment validation in `src/lib/env.ts`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as the primary public key variable
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` as a temporary fallback for older project configuration

The app remains in local demo mode when `NEXT_PUBLIC_DEMO_MODE=true`.

## Alternatives Considered

- Use only `@supabase/supabase-js`: simpler, but weaker fit for Next.js server-side auth and cookie-based sessions.
- Implement authentication before environment validation: faster visible progress, but more fragile because auth depends on reliable Supabase configuration.
- Require Supabase credentials immediately: closer to production, but would break local demo mode before the database schema and auth flow are ready.

## Consequences

### Positive

- Supabase setup is isolated behind reusable utilities.
- Demo mode remains available without secrets.
- Future auth, repository, and protected-route work has a stable integration point.
- Environment errors fail early with clear messages.

### Negative

- The app still does not persist data to Supabase until the repository layer and schema are implemented.
- Both publishable-key and anon-key naming are supported temporarily, which adds a small compatibility branch.

## Future Revisit Date

Revisit after authentication and RLS are implemented.
