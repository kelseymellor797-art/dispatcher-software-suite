# Security Notes

## Current Security Status

The current MVP is not production-secure. It is a local demo application with browser localStorage persistence and fictional seed data.

Implemented safeguards:

- TypeScript and Zod validation for service request input.
- Runtime environment validation for Supabase configuration.
- `.env.example` warns not to expose service-role keys.
- No real credentials are stored in the repository.

Not yet implemented:

- authentication.
- protected routes.
- user profiles.
- roles.
- server-side authorization.
- Supabase tables.
- RLS.
- production persistence.
- audit-grade activity history.
- Sentry monitoring.
- secure GPS ingestion.

## Supabase Security Requirements

Future Supabase implementation must:

- enable RLS on every table in exposed schemas.
- create policies that match actual user permissions.
- avoid using user-editable metadata for authorization.
- keep service-role keys server-only.
- avoid putting privileged security definer functions in exposed schemas.
- verify policies with tests for allowed and denied access.
- use migrations for schema and policy changes.
- inspect existing schema before applying changes.

## Application Authorization Requirements

Roles under consideration:

- dispatcher.
- supervisor.
- manager.
- read-only.
- admin.

Roles should be added only where justified by workflow differences. Server-side enforcement must be the source of truth. Client-side UI hiding is a convenience, not security.

## GPS Security Requirements

Future Traccar integration must:

- authenticate inbound data or sync requests.
- validate payload shape and timestamps.
- map external device identifiers to internal tracker records.
- prevent unauthorized ingestion.
- reduce replay risk where practical.
- handle duplicates idempotently.
- keep Traccar credentials out of browser bundles.
- log failures without leaking secrets.

## Secrets

Never commit:

- Supabase service role keys.
- Supabase project tokens.
- Vercel tokens.
- Sentry auth tokens or DSNs if they are intended to remain private.
- Traccar admin credentials.
- tracker IMEI/device secrets.
- SIM account credentials.
- SMS configuration secrets.

## Open Risks

- The app currently trusts browser state for all business actions.
- Demo data can be edited by any local browser user.
- There is no production audit trail.
- There is no rate limiting or abuse protection.
- There is no authorization boundary around assignment override.
- Future maps/GPS features will introduce location privacy requirements.

## Security Review Checkpoints

Run a security review after:

- auth and roles are added.
- initial RLS policies are implemented.
- realtime subscriptions are enabled.
- Traccar ingestion endpoints are added.
- deployment configuration is prepared.
