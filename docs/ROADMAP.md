# Roadmap

## Long-Term Goal

Transform Dispatcher Software Suite into a secure, production-ready, real-time towing operations platform integrated with a physical GPS tracker through Traccar.

## Current Phase

Phase 1 - Repository and architecture audit.

## Completed Work

- Audited project structure, routes, components, dependencies, Supabase integration, tests, and validation scripts.
- Confirmed the application is a Next.js App Router app with TypeScript, Tailwind CSS, React Hook Form, Zod, Lucide React, Supabase SSR helpers, and Vitest.
- Confirmed current persistence is local browser storage through `DispatchProvider`, using fictional demo data from `src/domain/seed.ts`.
- Confirmed Supabase integration is currently foundational only: environment validation plus browser/server client factories.
- Confirmed there is no `supabase/` directory, migration history, local Supabase config, database schema, auth flow, protected routes, or RLS policy implementation in the repository.
- Created initial architecture, GPS, security, deployment, decision, and demo documentation.

## Validation Results

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

Status: not started.

Planned scope:

- Verify current Supabase Auth documentation before implementation.
- Add Supabase auth flow and session handling.
- Add protected routes.
- Design profile/role storage with server-enforced permissions.
- Add database migrations and RLS policies.
- Test role behavior and unsafe access attempts.

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

- The repository currently has no commits, so there is no stable baseline diff or branch history.
- The current app is client-state/localStorage backed; moving to Supabase persistence will require careful repository abstraction and workflow parity tests.
- There is no database schema or migration history yet, so RLS cannot be verified until Phase 2 creates or connects to a real schema.
- Supabase service role key is listed in `.env.example`; future implementation must ensure it is never exposed to browser code or used casually in request handlers.
- Authorization roles are not yet justified by real workflows; overbuilding roles too early could create complexity and weak policy coverage.
- Physical GPS integration depends on tracker model, SIM/APN setup, Traccar hosting, and real connectivity that cannot be fully completed without user participation.
- Mapping and ETA providers may introduce paid services, credential handling, and privacy concerns.
- Browser localStorage demo behavior should remain available until production persistence is verified, but must not be mistaken for production data handling.

## Missing Information

- Supabase project reference, local Supabase config, or linked MCP/project access.
- Existing database schema, if any exists outside the repository.
- Desired auth provider setup: email/password, magic link, OAuth, invited users, or admin-created users.
- Role model details: which exact actions each role should perform.
- Physical tracker make/model, IMEI/device identifier handling requirements, supported protocol, and configuration method.
- SpeedTalk SIM plan details and verified APN/SMS configuration instructions.
- Preferred map provider and routing provider constraints.
- Deployment target for persistent Traccar or integration worker.
- Whether this repository should remain demo-capable after production persistence is added.

## Decisions Awaiting Approval

- Whether Phase 2 should first create a local Supabase migration set from the current TypeScript domain model, or connect to an existing Supabase project and inspect its schema.
- Whether demo mode should remain as a supported offline mode after Supabase persistence exists.
- Which authentication method should be implemented first.
- Whether to create a Git baseline commit before Phase 2 implementation.

## Proposed First Small Implementation Milestone

Phase 2A: Supabase persistence and auth foundation design.

Deliverables:

- Confirm Supabase project access or initialize local Supabase config.
- Create the first migration for `profiles`, `service_requests`, `drivers`, and `activity_logs` from the existing domain model.
- Add RLS enabled on every public table.
- Add minimally privileged policies for authenticated users, initially using a conservative dispatcher/admin model until detailed role permissions are approved.
- Generate or define TypeScript database types.
- Add repository tests that prove current workflow behavior can be preserved against the new persistence contract.
- Keep existing demo mode working until Supabase mode is verified.

This milestone should stop before GPS work.

## Next Action

Get user approval for the Phase 2A milestone and confirm whether to connect to an existing Supabase project or initialize local Supabase migrations first.
