insert into auth.users (id, email, raw_user_meta_data)
values
  ('00000000-0000-4000-8000-000000000001', 'admin.dispatcher.local@example.test', '{"full_name":"Avery Admin"}'::jsonb),
  ('00000000-0000-4000-8000-000000000002', 'supervisor.dispatcher.local@example.test', '{"full_name":"Sam Supervisor"}'::jsonb),
  ('00000000-0000-4000-8000-000000000003', 'dispatcher.local@example.test', '{"full_name":"Drew Dispatcher"}'::jsonb),
  ('00000000-0000-4000-8000-000000000004', 'readonly.dispatcher.local@example.test', '{"full_name":"Riley Readonly"}'::jsonb)
on conflict (id) do nothing;

update public.profiles
set role = 'admin', full_name = 'Avery Admin'
where id = '00000000-0000-4000-8000-000000000001';

update public.profiles
set role = 'supervisor', full_name = 'Sam Supervisor'
where id = '00000000-0000-4000-8000-000000000002';

update public.profiles
set role = 'dispatcher', full_name = 'Drew Dispatcher'
where id = '00000000-0000-4000-8000-000000000003';

update public.profiles
set role = 'read_only', full_name = 'Riley Readonly'
where id = '00000000-0000-4000-8000-000000000004';

insert into public.drivers (id, name, phone, status, is_active, created_at, updated_at)
values
  ('10000000-0000-4000-8000-000000000001', 'Jordan Miles', '555-0101', 'available', true, '2026-07-18T08:30:00Z', '2026-07-18T15:15:00Z'),
  ('10000000-0000-4000-8000-000000000002', 'Casey Rivera', '555-0102', 'assigned', true, '2026-07-18T08:30:00Z', '2026-07-18T14:50:00Z'),
  ('10000000-0000-4000-8000-000000000003', 'Morgan Lee', '555-0103', 'unavailable', true, '2026-07-18T08:30:00Z', '2026-07-18T15:05:00Z'),
  ('10000000-0000-4000-8000-000000000004', 'Taylor Chen', '555-0104', 'off_duty', true, '2026-07-18T08:30:00Z', '2026-07-18T13:30:00Z')
on conflict (id) do nothing;

insert into public.service_requests (
  id,
  customer_name,
  customer_phone,
  pickup_address,
  destination_address,
  vehicle_description,
  service_type,
  notes,
  status,
  assigned_driver_id,
  created_at,
  updated_at,
  completed_at
)
values
  (
    '20000000-0000-4000-8000-000000000001',
    'Fictional Customer A',
    '555-0201',
    '100 Demo Way',
    '200 Sample Ave',
    'Blue sedan',
    'Tow',
    'Local development active request assigned to a driver.',
    'active',
    '10000000-0000-4000-8000-000000000002',
    '2026-07-18T14:00:00Z',
    '2026-07-18T14:50:00Z',
    null
  ),
  (
    '20000000-0000-4000-8000-000000000002',
    'Fictional Customer B',
    '555-0202',
    '300 Placeholder Rd',
    '',
    'White SUV',
    'Roadside assistance',
    'Local development unassigned request.',
    'pending',
    null,
    '2026-07-18T14:55:00Z',
    '2026-07-18T14:55:00Z',
    null
  ),
  (
    '20000000-0000-4000-8000-000000000003',
    'Fictional Customer C',
    '555-0203',
    '400 Example St',
    '500 Sample Ln',
    'Gray hatchback',
    'Vehicle transport',
    'Local development completed request.',
    'completed',
    '10000000-0000-4000-8000-000000000001',
    '2026-07-18T11:30:00Z',
    '2026-07-18T12:30:00Z',
    '2026-07-18T12:30:00Z'
  )
on conflict (id) do nothing;

insert into public.activity_logs (id, entity_type, entity_id, action, details, metadata, created_by, created_at)
values
  (
    '30000000-0000-4000-8000-000000000001',
    'service_request',
    '20000000-0000-4000-8000-000000000001',
    'request_created',
    'Local development request created.',
    '{}'::jsonb,
    '00000000-0000-4000-8000-000000000003',
    '2026-07-18T14:00:00Z'
  ),
  (
    '30000000-0000-4000-8000-000000000002',
    'service_request',
    '20000000-0000-4000-8000-000000000001',
    'driver_assigned',
    'Casey Rivera assigned.',
    '{"previous_driver_id":null,"new_driver_id":"10000000-0000-4000-8000-000000000002"}'::jsonb,
    '00000000-0000-4000-8000-000000000003',
    '2026-07-18T14:45:00Z'
  ),
  (
    '30000000-0000-4000-8000-000000000003',
    'service_request',
    '20000000-0000-4000-8000-000000000003',
    'request_completed',
    'Local development request completed.',
    '{}'::jsonb,
    '00000000-0000-4000-8000-000000000002',
    '2026-07-18T12:30:00Z'
  ),
  (
    '30000000-0000-4000-8000-000000000004',
    'service_request',
    '20000000-0000-4000-8000-000000000001',
    'assignment_override',
    'Supervisor override recorded for audit demonstration.',
    '{"acting_user_id":"00000000-0000-4000-8000-000000000002","reason":"Fictional local test override reason","previous_driver_id":null,"new_driver_id":"10000000-0000-4000-8000-000000000002","previous_state":"unassigned","new_state":"assigned","occurred_at":"2026-07-18T14:45:00Z"}'::jsonb,
    '00000000-0000-4000-8000-000000000002',
    '2026-07-18T14:45:00Z'
  )
on conflict (id) do nothing;
