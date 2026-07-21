# Decisions

## ADR Index

- `docs/adr/0001-supabase-ssr-integration.md` - accepted Supabase SSR client foundation.

## Current Working Decisions

### Keep Demo Mode Until Production Persistence Is Verified

Status: proposed.

Reasoning:

The current UI and workflow tests are local-demo backed. Keeping demo mode during the Supabase transition allows comparison against existing behavior and avoids breaking the app while production persistence is introduced incrementally.

### Add Persistence Boundary Before Replacing Local State

Status: proposed.

Reasoning:

The domain workflow functions are already centralized. A repository boundary can let the UI call stable operations while the data source changes from localStorage to Supabase.

### Implement Auth Before Realtime and GPS

Status: proposed.

Reasoning:

Realtime subscriptions and GPS positions expose operational data. Auth and RLS should exist before those features are added to avoid building on unsafe access assumptions.

### Do Not Add Mock GPS Data as Integration Proof

Status: accepted by project goal.

Reasoning:

The GPS feature must demonstrate a real physical tracker through Traccar. Mock coordinates may be useful in isolated unit tests, but cannot be presented as a working tracker integration.

## Decisions Needed

- Which Supabase project or local Supabase environment should Phase 2 use?
- Should the current uncommitted repo be committed as a baseline before implementation?
- Which auth method should be implemented first?
- Which role permissions are actually needed in the first production slice?
- Which tracker model and Traccar protocol will be used?
- Which map/routing provider should be evaluated first?
