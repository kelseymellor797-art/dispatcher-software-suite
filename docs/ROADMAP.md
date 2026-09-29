# Roadmap

## Long-Term Goal

Transform Dispatcher Software Suite into a secure, production-ready, real-time towing operations platform integrated with a physical GPS tracker through Traccar.

## Current Phase

Phase 2A - Local Supabase auth, schema, RLS, and repository boundary preparation.

## Completed Work

- Audited project structure, routes, components, dependencies, Supabase integration, tests, and validation scripts.
- Confirmed the application is a Next.js App Router app with TypeScript, Tailwind CSS, React Hook Form, Zod, Lucide React, Supabase SSR helpers, and Vitest.
- Confirmed current persistence is local browser storage through `DispatchProvider`, using fictional demo data from `src/domain/seed.ts`.
- Confirmed Supabase integration is currently foundational only: environment validation plus browser/server client factories.
- Confirmed there is no `supabase/` directory, migration history, local Supabase config, database schema, auth flow, protected routes, or RLS policy implementation in the repository.
- Created initial architecture, GPS, security, deployment, decision, and demo documentation.
- Baseline repository was committed and pushed to `https://github.com/kelseymellor797-art/dispatcher-software-suite`.
- Phase 2A design was approved with a dedicated Supabase project, private admin-managed auth, reduced role set, no hard deletes, and local-first migrations.

## Validation Results

Latest Phase 2A local validation on 2026-07-21:

- `npm run supabase:reset` - passed, local database recreated from migrations and fictional seed data.
- `npm run supabase:test` - passed, 1 pgTAP file and 12 RLS tests.
- `npm run supabase:types` - passed, generated `src/lib/supabase/database.types.ts`.
- `npx supabase migration list --local` - passed, local migration `20260721092751_dispatcher_phase_2a_schema` is applied.
- `npm run typecheck` - passed.
- `npm run lint` - passed.
- `npm run test` - passed, 3 test files and 17 tests.
- `npm run build` - passed, 10 app routes generated.

Latest Phase 1 validation on 2026-07-20:

- `npm run typecheck` - passed.
- `npm run lint` - passed.
- `npm run test` - passed, 2 test files and 14 tests.
- `npm run build` - passed, 10 app routes generated.

## Phase Plan

### Phase 1 - Repository and Architecture Audit

Status: complete, pending user approval to proceed to Phase 2.

Scope:

- Inspect repository structure.
- Review Supabase integration.
- Review dependencies.
- Review tests and validation scripts.
- Identify risks and missing information.
- Create or update project documentation.
- Propose the first small implementation milestone.

Exit criteria:

- Documentation reflects current architecture and gaps.
- Risks and missing information are explicitly listed.
- Next implementation milestone is small, testable, and approved by the user.

### Phase 2 - Authentication and Authorization

Status: complete locally, pending user participation to create/authorize the dedicated Supabase project before remote dry run or migration application.

Planned scope:

- Verify current Supabase Auth documentation before implementation.
- Add Supabase auth flow and session handling.
- Add protected routes.
- Design profile/role storage with server-enforced permissions.
- Add database migrations and RLS policies.
- Test role behavior and unsafe access attempts.

Phase 2A approved implementation scope:

- Update `ROADMAP.md` and `DECISIONS.md` with approved decisions.
- Prepare the dedicated-project setup plan.
- Initialize local Supabase configuration.
- Create reviewed local migration files.
- Add local development seed data containing fictional data only.
- Add database types.
- Add repository interfaces and test scaffolding.
- Add RLS tests for allowed and denied operations.
- Run Next.js validation and local Supabase reset/migration verification.
- Present migration SQL, policy summary, validation results, and remote dry-run plan.

Completed locally:

- Updated roadmap, decisions, architecture, security, and Supabase setup docs.
- Initialized local Supabase configuration.
- Created migration `20260721092751_dispatcher_phase_2a_schema.sql`.
- Added fictional local seed data.
- Added generated database types.
- Added repository interface and demo repository test scaffolding.
- Added pgTAP RLS tests.
- Verified local database reset, migration status, RLS tests, generated types, TypeScript, lint, unit tests, and production build.

Phase 2A explicit exclusions:

- Do not use or alter the existing shared Supabase project.
- Do not apply migrations to any remote project.
- Do not deploy.
- Do not enable public access.
- Do not expose secrets.
- Do not create real users.
- Do not remove demo mode.

### Phase 3 - Application Realtime

Status: not started.

Planned scope:

- Subscribe to dispatch, driver, and activity changes.
- Update the UI across two browser sessions.
- Handle reconnects, duplicate events, and user-visible notifications.

### Phase 4 - GPS Domain Model

Status: not started.

Planned scope:

- Add tracker devices, units/vehicles, associations, latest positions, position history, freshness state, Traccar identifiers, and ingestion audit data.
- Add constraints, indexes, RLS, TypeScript types, and tests.

### Phase 5 - Traccar Development Environment

Status: not started.

Planned scope:

- Verify physical tracker model and protocol.
- Configure SIM/APN through verified manufacturer instructions.
- Run or deploy development Traccar.
- Register the tracker with its real identifier.
- Verify Traccar receives a real position.

Blocker:

- Requires user participation for physical tracker, SIM, SMS setup, account access, or billing.

### Phase 6 - Secure Traccar Integration

Status: not started.

Planned scope:

- Select an integration pattern.
- Authenticate and validate ingestion.
- Map Traccar devices to internal records.
- Handle retries, duplicate events, timestamps, and safe logging.

### Phase 7 - Live Location Interface

Status: not started.

Planned scope:

- Add a theme-aware map using real tracker data.
- Show freshness, speed, heading, connection state, and no-position states.

### Phase 8 - Dispatch and GPS Association

Status: not started.

Planned scope:

- Associate tracker/unit/driver.
- Show assigned vehicle position on dispatch details.
- Preserve historical associations and prevent conflicts.

### Phase 9 - Routing and ETA

Status: not started.

Planned scope:

- Evaluate routing providers and pricing.
- Calculate ETA from real vehicle position to pickup when coordinates exist.
- Handle missing coordinates and provider failures honestly.

### Phase 10 - Location History and Replay

Status: not started.

Planned scope:

- Store history with retention.
- Show completed dispatch route history from real stored positions.
- Address privacy and storage growth.

### Phase 11 - Observability and Deployment

Status: not started.

Planned scope:

- Configure Sentry.
- Deploy Next.js to Vercel.
- Deploy Traccar or integration service to persistent infrastructure.
- Configure health checks, env vars, logging, and rollback docs.

### Phase 12 - Final Hardening and Presentation

Status: not started.

Planned scope:

- Run security review.
- Fix high-confidence findings.
- Complete accessibility/responsive checks.
- Update portfolio explanation and demo checklist.

## Risks

- The existing connected Supabase project is shared with unrelated application tables and must not be used for Dispatcher without explicit future approval.
- A dedicated Dispatcher Supabase project does not exist yet in this workflow, so remote linking and migration application are blocked until the user participates in project creation/authorization.
- The current app is client-state/localStorage backed; moving to Supabase persistence requires a repository boundary and workflow parity tests.
- Local RLS tests can verify policy intent, but remote settings such as public signup disabled, email confirmation, SMTP, and leaked-password protection must be confirmed in the dedicated project dashboard/API before production use.
- Supabase service role key is listed in `.env.example`; future implementation must ensure it is never exposed to browser code or used casually in request handlers.
- Authorization is intentionally limited to `read_only`, `dispatcher`, `supervisor`, and `admin`; `manager` is deferred until a concrete permission difference exists.
- Physical GPS integration depends on tracker model, SIM/APN setup, Traccar hosting, and real connectivity that cannot be fully completed without user participation.
- Mapping and ETA providers may introduce paid services, credential handling, and privacy concerns.
- Browser localStorage demo behavior should remain available until production persistence is verified, but must not be mistaken for production data handling.

## Missing Information

- Dedicated Supabase project reference and confirmed region/organization.
- Dedicated project auth settings confirmation: public signups disabled, email confirmation enabled, password reset configured.
- Physical tracker make/model, IMEI/device identifier handling requirements, supported protocol, and configuration method.
- SpeedTalk SIM plan details and verified APN/SMS configuration instructions.
- Preferred map provider and routing provider constraints.
- Deployment target for persistent Traccar or integration worker.
- Whether this repository should remain demo-capable after production persistence is added.

## Decisions Awaiting Approval

- Which organization and region should host the dedicated Dispatcher Supabase project.
- Whether to apply local migrations to the dedicated project after local reset/types/tests pass and dry-run output is reviewed.
- Whether admin users will be created through Supabase Dashboard invites first or through a later admin-only server action.

## Proposed First Small Implementation Milestone

Phase 2A: Local Supabase auth, schema, RLS, and repository boundary preparation.

Deliverables:

- Initialize local Supabase config.
- Create local migrations for `profiles`, `service_requests`, `drivers`, and `activity_logs` from the existing domain model and approved revisions.
- Add RLS enabled on every new public table.
- Add private role helper functions with fixed `search_path`.
- Add policies for `read_only`, `dispatcher`, `supervisor`, and `admin`.
- Generate TypeScript database types from local schema.
- Add repository interface and tests that preserve demo mode and workflow behavior.
- Keep existing demo mode working until Supabase mode is verified.

This milestone should stop before GPS work.

## Next Action

Stop for user participation to create/authorize the dedicated Supabase project. After the project exists and is confirmed, run `npx supabase link --project-ref <dedicated-project-ref>` and `npx supabase db push --dry-run` only with explicit approval.
