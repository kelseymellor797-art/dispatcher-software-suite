# Security Notes

## Current Security Status

The current MVP is not production-secure. It is a local demo application with browser localStorage persistence and fictional seed data.

Implemented safeguards:

- TypeScript and Zod validation for service request input.
- Runtime environment validation for Supabase configuration.
- `.env.example` warns not to expose service-role keys.
- No real credentials are stored in the repository.
- Local Phase 2A migration enables RLS on every new Dispatcher table.
- Local Phase 2A role helpers live in a non-exposed `private` schema.
- Local Phase 2A activity logs are append-only from client roles.
- Local Phase 2A pgTAP tests cover allowed and denied policy behavior.

Not yet implemented:

- authentication.
- protected routes.
- server-side authorization.
- production persistence.
- audit-grade activity history.
- Sentry monitoring.
- secure GPS ingestion.
- dedicated remote Supabase project configuration.

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

Approved initial roles:

- `read_only`
- `dispatcher`
- `supervisor`
- `admin`

`manager` is deferred until there is a concrete permission difference. Server-side enforcement must be the source of truth. Client-side UI hiding is a convenience, not security.

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
- Assignment override policy exists locally, but the application still needs server-side workflow implementation requiring explicit override reasons.
- Remote auth settings such as public signup disabled and email confirmation enabled still need to be configured on the dedicated project.
- Future maps/GPS features will introduce location privacy requirements.

## Security Review Checkpoints

Run a security review after:

- auth and roles are added.
- initial RLS policies are implemented.
- realtime subscriptions are enabled.
- Traccar ingestion endpoints are added.
- deployment configuration is prepared.
