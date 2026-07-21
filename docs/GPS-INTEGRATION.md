# GPS Integration Plan

## Current Status

GPS integration has not started. The current app has no tracker, vehicle, location, map, coordinate, route, or ETA schema.

No fake coordinates should be added as proof of integration.

## Target Outcome

The production system should:

- receive real position updates from a physical GPS tracker through Traccar.
- securely sync Traccar device and position data into the application.
- associate a tracker with a vehicle/unit and driver.
- show live location, freshness, speed, heading, and connection state.
- show assigned vehicle location on dispatch details.
- preserve historical positions for completed work where allowed.
- calculate ETA only when real coordinates and routing support exist.

## Required User Participation

Stop and request user input when any of these are required:

- physical access to the tracker.
- tracker make/model or protocol confirmation.
- IMEI or unique device identifier.
- SIM details.
- SMS configuration.
- SpeedTalk APN/account access.
- Traccar account/server credentials.
- billing or paid service activation.
- exposing a public endpoint.

## Information Needed

- Tracker manufacturer and exact model.
- Supported Traccar protocol.
- Configuration method: SMS, vendor app, USB, web portal, or Bluetooth.
- SIM provider details and APN settings from verified documentation.
- Whether the tracker reports ignition, battery, odometer, heading, speed, and connection events.
- Preferred hosting target for Traccar or integration service.
- Privacy and retention expectations for location history.

## Integration Options To Evaluate

1. Authenticated Traccar webhook into a Next.js route handler or dedicated worker.
2. Scheduled synchronization from Traccar API.
3. Persistent integration worker that polls or subscribes to Traccar.
4. Traccar event forwarding into a queue or ingestion endpoint.

Selection criteria:

- authentication strength.
- replay resistance.
- retry behavior.
- duplicate handling.
- operational simplicity.
- hosting fit.
- secret isolation.
- cost.

## Planned Data Model

Future schema should cover only required production concepts:

- tracker devices.
- vehicles or units.
- driver-to-unit association.
- latest known tracker position.
- position history.
- tracker connection/freshness state.
- external Traccar identifiers.
- ingestion audit information.

## Security Rules

- Traccar credentials must never be sent to the browser.
- Ingestion endpoints must authenticate requests.
- Incoming location payloads must be validated.
- Device identifiers must be mapped to internal records.
- Duplicate positions must be handled safely.
- Timestamps must preserve source time and ingestion time.
- Logs must not expose secrets or sensitive tracker identifiers unnecessarily.

## Map and ETA Rules

- The map must display real tracker data only.
- Missing location should produce a clear no-position state.
- Stale and disconnected trackers must be visibly distinct.
- ETA must be labeled with calculation time and provider source.
- Provider failure must be shown honestly; do not invent fallback ETAs.
