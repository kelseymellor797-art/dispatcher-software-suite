# Dispatcher Software Suite Agent Guide

## Mission

Transform this Next.js towing dispatch MVP into a secure, production-ready, real-time operations platform with Supabase persistence/auth/RLS/realtime, Traccar GPS integration, Vercel deployment, Sentry monitoring, and clear documentation.

## Session Startup

At the start of every work session:

1. Read `AGENTS.md`.
2. Read `docs/ROADMAP.md`.
3. Run `git status --short --branch`.
4. Confirm the active phase and next incomplete task.
5. Inspect relevant code and schema before proposing changes.
6. Continue from the next verified task; do not redo completed work unless validation shows a problem.

## Working Rules

- Preserve existing workflows unless the user explicitly approves a behavioral change.
- Do not replace working application data with mock production data.
- Never commit credentials, device identifiers that should remain private, SIM details, tokens, or service-role keys.
- Use environment variables for credentials and document required variables in `.env.example` or deployment docs.
- Use Supabase migrations for schema changes once schema work begins.
- Inspect current Supabase schema before proposing database changes.
- Enable and verify RLS for exposed Supabase tables before treating data access as production-safe.
- Use server-side authorization for privileged actions; do not rely on client-side role checks alone.
- Stop for approval before destructive, expensive, externally visible, irreversible, deployment, DNS, billing, or production-data actions.
- Stop for user participation when physical tracker access, SIM/SMS configuration, account authentication, or billing is required.
- Do not use fake GPS coordinates as proof of Traccar integration.
- Keep documentation current when architecture, env vars, deployment, or security decisions change.

## Validation

Run relevant checks after each major phase:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

For UI or realtime work, also perform browser verification on desktop and mobile viewports. For realtime, verify behavior across two independent browser sessions.

## Current Architecture Snapshot

- Framework: Next.js App Router, React, TypeScript.
- Styling: Tailwind CSS with CSS custom property design tokens for light/dark themes.
- State: client `DispatchProvider` with localStorage-backed demo state.
- Domain rules: centralized in `src/domain/workflows.ts`.
- Supabase: SSR/browser client factories and env validation exist, but no migrations, auth flow, RLS policies, or production repository layer exist yet.
- Tests: Vitest unit tests for domain workflows and environment validation.

## Important Local Note

If `npm run build` is run while a dev server is active, the Next.js `.next` directory can conflict with the running dev server. If the dev server starts returning manifest or RSC errors, stop the dispatcher dev process, remove `.next`, and restart `npm run dev`.
