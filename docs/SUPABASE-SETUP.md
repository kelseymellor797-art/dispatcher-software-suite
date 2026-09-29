# Supabase Setup Plan

## Current Status

Phase 2A uses local-first Supabase development only.

The existing shared Supabase project must not be used for Dispatcher Software Suite. It contains unrelated application tables and security findings. Those findings are external concerns and are not remediated from this repository.

No remote Dispatcher project has been linked yet.

## Dedicated Project Creation

Stop for user participation if project creation requires:

- Supabase dashboard interaction.
- authentication.
- organization selection.
- billing.
- region selection.
- credentials.

Recommended project settings:

- Name: `Dispatcher Software Suite`.
- Region: choose the region closest to the expected operating area and Vercel deployment region.
- Database major version: match local config, currently Postgres 17.
- Public signups: disabled.
- Email/password auth: enabled.
- Email confirmation: enabled.
- Anonymous sign-ins: disabled.
- Password reset: enabled.
- Password minimum length: at least 8.
- Password requirements: lower, upper, digit.
- Leaked password protection: enable when plan supports it.
- Custom SMTP: required before real production invites/resets.

## Local Workflow

Use local migrations first:

```bash
npx supabase start
npm run supabase:reset
npm run supabase:test
npm run supabase:types
npm run typecheck
npm run lint
npm run test
npm run build
```

`supabase/seed.sql` contains fictional development data only.

## Remote Workflow After Approval

Do not run these commands until the dedicated project exists and the user approves the exact target:

```bash
npx supabase link --project-ref <dedicated-dispatcher-project-ref>
npx supabase db push --dry-run
```

After the dry run is reviewed and explicitly approved:

```bash
npx supabase db push
```

Do not use `--include-seed` on production.

## Environment Variables

Local Supabase outputs development URLs and keys when the stack starts. Do not commit those values.

Production/preview values belong in secure deployment environment variables:

```bash
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be exposed through `NEXT_PUBLIC_*`.
