BEGIN;
SELECT plan(12);

SELECT has_table('public', 'profiles', 'profiles table exists');
SELECT has_table('public', 'service_requests', 'service_requests table exists');
SELECT has_table('public', 'drivers', 'drivers table exists');
SELECT has_table('public', 'activity_logs', 'activity_logs table exists');

SET LOCAL ROLE anon;
SELECT throws_ok(
  $$ select count(*) from public.service_requests $$,
  '42501',
  null,
  'anonymous users cannot access service requests'
);

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000004', true);
SELECT is(
  (select count(*)::integer from public.service_requests),
  3,
  'read_only users can read service requests'
);
SELECT throws_ok(
  $$
    insert into public.service_requests (
      customer_name,
      customer_phone,
      pickup_address,
      destination_address,
      vehicle_description,
      service_type
    )
    values (
      'RLS Readonly Customer',
      '555-0300',
      '1 Readonly Way',
      '',
      'Test vehicle',
      'Tow'
    )
  $$,
  '42501',
  null,
  'read_only users cannot create service requests'
);

SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000003', true);
SELECT lives_ok(
  $$
    insert into public.service_requests (
      id,
      customer_name,
      customer_phone,
      pickup_address,
      destination_address,
      vehicle_description,
      service_type
    )
    values (
      '20000000-0000-4000-8000-000000000101',
      'RLS Dispatcher Customer',
      '555-0301',
      '1 Dispatcher Way',
      '',
      'Test vehicle',
      'Tow'
    );

    update public.service_requests
    set assigned_driver_id = '10000000-0000-4000-8000-000000000001'
    where id = '20000000-0000-4000-8000-000000000101';
  $$,
  'dispatcher can create requests and assign available drivers'
);

SELECT throws_ok(
  $$
    insert into public.service_requests (
      id,
      customer_name,
      customer_phone,
      pickup_address,
      destination_address,
      vehicle_description,
      service_type
    )
    values (
      '20000000-0000-4000-8000-000000000102',
      'RLS Dispatcher Blocked Customer',
      '555-0302',
      '2 Dispatcher Way',
      '',
      'Test vehicle',
      'Tow'
    );

    update public.service_requests
    set assigned_driver_id = '10000000-0000-4000-8000-000000000003'
    where id = '20000000-0000-4000-8000-000000000102';
  $$,
  null,
  'Dispatchers can only assign available drivers.',
  'dispatcher cannot assign unavailable drivers'
);

SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000002', true);
SELECT lives_ok(
  $$
    insert into public.service_requests (
      id,
      customer_name,
      customer_phone,
      pickup_address,
      destination_address,
      vehicle_description,
      service_type
    )
    values (
      '20000000-0000-4000-8000-000000000103',
      'RLS Supervisor Customer',
      '555-0303',
      '3 Supervisor Way',
      '',
      'Test vehicle',
      'Tow'
    );

    update public.service_requests
    set assigned_driver_id = '10000000-0000-4000-8000-000000000003'
    where id = '20000000-0000-4000-8000-000000000103';
  $$,
  'supervisor can override unavailable driver assignment'
);

SELECT throws_ok(
  $$ update public.activity_logs set details = 'mutated' where id = '30000000-0000-4000-8000-000000000001' $$,
  '42501',
  null,
  'activity logs cannot be updated by authenticated clients'
);

SELECT set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000000001', true);
SELECT throws_ok(
  $$ update public.profiles set role = 'read_only' where id = '00000000-0000-4000-8000-000000000001' $$,
  null,
  'Users cannot modify their own role.',
  'admins cannot modify their own role'
);

SELECT * FROM finish();
ROLLBACK;
