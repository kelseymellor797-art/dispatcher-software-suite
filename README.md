# Dispatcher Software Suite

Dispatcher Software Suite is a local MVP for a towing-dispatch workflow system.

The project was inspired by firsthand towing-dispatch experience and observed workflow problems involving fragmented information, repetitive data entry, driver-status visibility, and request tracking.

This is a portfolio MVP. It has not been deployed or used by a towing company.

## Current MVP Scope

- Create service requests
- View active service requests
- View completed service requests
- Search request history
- Filter requests by status
- View available drivers
- Assign, reassign, and unassign drivers
- Update request status
- Update driver status
- Complete requests
- Record important workflow changes in an activity log
- Run with fictional demo data in local browser storage

## Tech Stack

- Next.js
- TypeScript
- React
- Tailwind CSS
- Zod
- React Hook Form
- Supabase client dependency
- Supabase SSR client utilities
- Local demo repository mode when Supabase credentials are not configured
- Vitest

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` when configuring environment variables.

```bash
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Do not commit real secrets.

`NEXT_PUBLIC_DEMO_MODE=true` keeps the app in local demo mode and allows Supabase credentials to be omitted.

`NEXT_PUBLIC_DEMO_MODE=false` requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is still accepted as a fallback for older Supabase projects, but new setup should use the publishable key variable.

## Database Setup

The current MVP runs in local demo mode using fictional seed data stored in browser local storage.

Supabase/PostgreSQL support is planned, but no production schema or credentials are required for this MVP.

The Supabase integration foundation is present:

- Validated runtime environment configuration
- Browser Supabase client factory
- Server Supabase client factory for Next.js App Router

Database tables, migrations, RLS policies, authentication pages, and protected routes are still planned.

## Seed Instructions

The app loads fictional demo data automatically when browser local storage is empty. This does not represent production usage.

To export the demo dataset for inspection:

```bash
npm run seed
```

This writes `demo-data.json`, which is ignored by git.

## Testing

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Current Limitations

- No production Supabase persistence yet
- No real authentication yet
- No finalized towing service-type list
- No finalized driver-status list
- No SMS, phone, map, billing, payroll, or towing-platform integrations
- No driver mobile app
- Demo data is fictional and local only

## Roadmap

1. Add production persistence with Supabase/PostgreSQL.
2. Add authentication and role-based access.
3. Add status event persistence.
4. Add reporting queries.
5. Add screenshots and a portfolio case study.

## Screenshots

TODO: Add screenshots after the UI is reviewed.

## Security Considerations

- Never commit secrets.
- Use fictional data for demos.
- Protect future dispatch data behind authentication.
- Validate user input before persistence.
- Use role-based authorization before real business use.
