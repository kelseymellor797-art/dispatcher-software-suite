# Demo Checklist

## Current Demo

The current demo is local and browser-state backed.

Demonstrable workflows:

- view dashboard metrics.
- create a dispatch.
- search and filter dispatches.
- open dispatch detail.
- assign a driver.
- override unavailable driver assignment.
- unassign a driver.
- update dispatch status.
- complete a dispatch.
- update driver status.
- view activity log.
- view reports.
- switch light, dark, and system themes.
- reset demo data.

## Current Limitations To State Honestly

- Data is local demo state, not production Supabase persistence.
- Authentication is not implemented.
- Roles are not implemented.
- Realtime multi-user updates are not implemented.
- GPS and Traccar integration are not implemented.
- Map and ETA are not implemented.
- Deployment and monitoring are not implemented.

## Future End-to-End Demo Goal

1. Sign in as an authenticated dispatcher.
2. Create a real Supabase-backed dispatch.
3. Assign a driver/unit.
4. Show another browser session updating in real time.
5. Show physical tracker position received by Traccar.
6. Show synchronized tracker position in the app.
7. Show stale/current tracker state.
8. Show assigned vehicle on dispatch detail.
9. Calculate ETA when routing is configured.
10. Complete dispatch and review activity/history.
11. Confirm Sentry and deployment health.

## Presentation Notes

The final presentation should explain:

- dispatch workflow problem.
- data model.
- auth and RLS security decisions.
- realtime implementation.
- Traccar integration architecture.
- GPS privacy and freshness handling.
- deployment and monitoring setup.
- testing and validation strategy.
