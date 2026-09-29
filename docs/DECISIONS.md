# Decisions

## ADR Index

- `docs/adr/0001-supabase-ssr-integration.md` - accepted Supabase SSR client foundation.

## Current Working Decisions

### Keep Demo Mode Until Production Persistence Is Verified

Status: accepted.

Reasoning:

The current UI and workflow tests are local-demo backed. Keeping demo mode during the Supabase transition allows comparison against existing behavior and avoids breaking the app while production persistence is introduced incrementally.

### Add Persistence Boundary Before Replacing Local State

Status: accepted.

Reasoning:

The domain workflow functions are already centralized. A repository boundary can let the UI call stable operations while the data source changes from localStorage to Supabase.

### Implement Auth Before Realtime and GPS

Status: accepted.

Reasoning:

Realtime subscriptions and GPS positions expose operational data. Auth and RLS should exist before those features are added to avoid building on unsafe access assumptions.

### Do Not Add Mock GPS Data as Integration Proof

Status: accepted by project goal.

Reasoning:

The GPS feature must demonstrate a real physical tracker through Traccar. Mock coordinates may be useful in isolated unit tests, but cannot be presented as a working tracker integration.

### Use a Dedicated Dispatcher Supabase Project

Status: accepted.

Reasoning:

The available shared Supabase project contains unrelated tables, migrations, and security findings. Dispatcher Software Suite needs an isolated project so migrations, RLS, auth settings, and future GPS data are not coupled to unrelated applications.

Constraints:

- Do not alter, repair, or clean up the unrelated shared project from this repository.
- Record shared-project findings only as an external concern.
- Stop for user participation if project creation requires dashboard interaction, authentication, organization selection, billing, region selection, or credentials.

### Use Private Administrator-Managed Email/Password Auth

Status: accepted.

Reasoning:

Dispatcher Software Suite is operational software, not a public signup product. Accounts should be created or invited by an administrator, and SSR cookie sessions with PKCE match the current Next.js/Supabase stack.

Requirements:

- Supabase email/password authentication.
- SSR cookie sessions through `@supabase/ssr`.
- PKCE flow.
- Public self-signup disabled.
- Users invited or created by an administrator.
- Email confirmation enabled.
- Password reset supported.
- New profiles default to `read_only` defensively.
- No user can assign or modify their own role.
- OAuth and SSO deferred.

### Use Four Initial Roles

Status: accepted.

Roles:

- `read_only`
- `dispatcher`
- `supervisor`
- `admin`

Deferred:

- `manager`, until there is a concrete permission difference.

Permissions:

- `read_only`: view dashboard, service requests, drivers, activity, and reports. No mutations.
- `dispatcher`: all read-only permissions; create service requests; edit permitted request details; assign, unassign, and reassign available drivers; update request status; complete requests. Cannot override unavailable/off-duty drivers, change driver status, or manage users/roles.
- `supervisor`: all dispatcher permissions; override unavailable/off-duty assignment with explicit reason; update driver status; manage operational driver records. Cannot manage admin roles.
- `admin`: all permissions; manage profiles and roles; manage system configuration; future integration administration.

### Disable Hard Deletes Initially

Status: accepted.

Reasoning:

Dispatch software should preserve operational history. Phase 2A will not expose client delete operations for service requests, drivers, profiles, or activity logs.

Lifecycle rules:

- Service requests are completed, not deleted.
- Drivers may be marked inactive or off duty.
- Users may be deactivated.
- Activity logs are append-only.

### Avoid Bidirectional Current Assignment Storage

Status: accepted.

Reasoning:

The current TypeScript demo model stores assignment on both service requests and drivers. The database schema should avoid duplicated relationship state and circular foreign keys.

Decision:

- `service_requests.assigned_driver_id` is the source of truth.
- Do not add `drivers.current_assignment_id`.
- Derive a driver's current assignment by querying active service requests with that `assigned_driver_id`.

### Use Local-First Migration Workflow

Status: accepted.

Reasoning:

Local migrations should be reviewed, reset-tested, type-generated, and tested before any remote schema is touched.

Remote migration application is blocked until:

- the dedicated Supabase project exists.
- the project is confirmed as the correct target.
- migrations pass a local database reset.
- generated types succeed.
- tests pass.
- the remote push has been previewed with a dry run.
- the user explicitly approves remote application.

## Decisions Needed

- Which organization and region should host the dedicated Dispatcher Supabase project?
- Should admin users be created by Dashboard invite first, or through a later admin-only server action?
- After local verification, should migrations be applied to the dedicated remote project?
- Which tracker model and Traccar protocol will be used?
- Which map/routing provider should be evaluated first?
