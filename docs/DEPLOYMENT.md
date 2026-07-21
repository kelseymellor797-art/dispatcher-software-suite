# Deployment Guide

## Current Status

The app is not deployed. It runs locally as a Next.js application.

Current local commands:

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
```

## Environment Variables

Current variables:

```bash
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Rules:

- `NEXT_PUBLIC_*` values are exposed to the browser.
- `SUPABASE_SERVICE_ROLE_KEY` must stay server-only.
- Do not configure production with real secrets until deployment steps are approved.

## Planned Vercel Deployment

Future Vercel deployment will require:

- linked GitHub repository.
- Vercel project.
- environment variables configured in Vercel.
- production Supabase project.
- Sentry configuration.
- build verification.
- rollback procedure.

Do not deploy or expose public endpoints without explicit approval.

## Planned Traccar Deployment

Traccar requires persistent server infrastructure. It should not be treated like a short-lived serverless function.

Options to evaluate later:

- VPS with Docker Compose.
- managed container host.
- cloud VM.
- dedicated integration worker plus hosted Traccar instance.

Traccar deployment must consider:

- persistent storage.
- TLS.
- firewall rules.
- backup strategy.
- admin credential storage.
- tracker protocol ports.
- monitoring.
- log retention.

## Health Checks

Future production readiness should include:

- Next.js application health route.
- Supabase connectivity check.
- Traccar sync or ingestion health check.
- Sentry error reporting verification.
- runbook for stale tracker or ingestion failures.

## Rollback

Rollback procedures are not yet defined. They should be documented before production deployment.
