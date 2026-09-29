create schema if not exists private;

create type public.app_role as enum (
  'read_only',
  'dispatcher',
  'supervisor',
  'admin'
);

create type public.request_status as enum (
  'pending',
  'active',
  'completed'
);

create type public.driver_status as enum (
  'available',
  'assigned',
  'unavailable',
  'off_duty'
);

create type public.dispatch_service_type as enum (
  'Tow',
  'Roadside assistance',
  'Vehicle transport',
  'Other'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.app_role not null default 'read_only',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.drivers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  status public.driver_status not null default 'available',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.service_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  pickup_address text not null,
  destination_address text not null default '',
  vehicle_description text not null,
  service_type public.dispatch_service_type not null,
  notes text not null default '',
  status public.request_status not null default 'pending',
  assigned_driver_id uuid references public.drivers(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz
);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null check (entity_type in ('service_request', 'driver')),
  entity_id uuid not null,
  action text not null,
  details text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default timezone('utc', now())
);

create unique index service_requests_one_active_assignment_per_driver_idx
  on public.service_requests (assigned_driver_id)
  where assigned_driver_id is not null and status <> 'completed';

create index service_requests_status_idx on public.service_requests (status);
create index service_requests_assigned_driver_id_idx on public.service_requests (assigned_driver_id);
create index service_requests_created_at_idx on public.service_requests (created_at desc);
create index service_requests_updated_at_idx on public.service_requests (updated_at desc);
create index drivers_status_idx on public.drivers (status);
create index drivers_is_active_idx on public.drivers (is_active);
create index activity_logs_entity_created_at_idx on public.activity_logs (entity_type, entity_id, created_at desc);
create index activity_logs_created_at_idx on public.activity_logs (created_at desc);
create index profiles_role_idx on public.profiles (role);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function private.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role
  from public.profiles p
  where p.id = (select auth.uid())
    and p.is_active = true
$$;

create or replace function private.has_role(allowed_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(private.current_user_role() = any(allowed_roles), false)
$$;

create or replace function private.can_read_dispatcher_data()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.has_role(array['read_only', 'dispatcher', 'supervisor', 'admin']::public.app_role[])
$$;

create or replace function private.can_dispatch()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.has_role(array['dispatcher', 'supervisor', 'admin']::public.app_role[])
$$;

create or replace function private.can_supervise()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.has_role(array['supervisor', 'admin']::public.app_role[])
$$;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select private.has_role(array['admin']::public.app_role[])
$$;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    'read_only'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create or replace function private.prevent_self_role_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) = new.id and old.role is distinct from new.role then
    raise exception 'Users cannot modify their own role.';
  end if;

  return new;
end;
$$;

create or replace function private.enforce_service_request_assignment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_driver public.drivers%rowtype;
  acting_role public.app_role;
begin
  if new.assigned_driver_id is null then
    return new;
  end if;

  if tg_op = 'UPDATE' and old.assigned_driver_id is not distinct from new.assigned_driver_id then
    return new;
  end if;

  select *
  into selected_driver
  from public.drivers
  where id = new.assigned_driver_id;

  if selected_driver.id is null then
    raise exception 'Assigned driver does not exist.';
  end if;

  if selected_driver.is_active is not true then
    raise exception 'Inactive drivers cannot be assigned.';
  end if;

  acting_role := private.current_user_role();

  if (select auth.uid()) is null then
    return new;
  end if;

  if acting_role = 'dispatcher' and selected_driver.status <> 'available' then
    raise exception 'Dispatchers can only assign available drivers.';
  end if;

  if acting_role is null or acting_role = 'read_only' then
    raise exception 'Current role cannot assign drivers.';
  end if;

  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger drivers_set_updated_at
before update on public.drivers
for each row execute function private.set_updated_at();

create trigger service_requests_set_updated_at
before update on public.service_requests
for each row execute function private.set_updated_at();

create trigger profiles_prevent_self_role_change
before update on public.profiles
for each row execute function private.prevent_self_role_change();

create trigger service_requests_enforce_assignment
before insert or update of assigned_driver_id on public.service_requests
for each row execute function private.enforce_service_request_assignment();

create trigger auth_users_create_profile
after insert on auth.users
for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.drivers enable row level security;
alter table public.service_requests enable row level security;
alter table public.activity_logs enable row level security;

revoke all on schema private from public;
revoke all on all functions in schema private from public;

grant usage on schema public to authenticated;
grant usage on schema private to authenticated;

grant select, update on public.profiles to authenticated;
grant select, insert, update on public.drivers to authenticated;
grant select, insert, update on public.service_requests to authenticated;
grant select, insert on public.activity_logs to authenticated;

grant execute on function private.current_user_role() to authenticated;
grant execute on function private.has_role(public.app_role[]) to authenticated;
grant execute on function private.can_read_dispatcher_data() to authenticated;
grant execute on function private.can_dispatch() to authenticated;
grant execute on function private.can_supervise() to authenticated;
grant execute on function private.is_admin() to authenticated;

create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (
  (id = (select auth.uid()) and is_active = true)
  or private.is_admin()
);

create policy "profiles_update_admin_only"
on public.profiles
for update
to authenticated
using (private.is_admin())
with check (private.is_admin());

create policy "drivers_select_authenticated_app_users"
on public.drivers
for select
to authenticated
using (private.can_read_dispatcher_data());

create policy "drivers_insert_supervisor_or_admin"
on public.drivers
for insert
to authenticated
with check (private.can_supervise());

create policy "drivers_update_supervisor_or_admin"
on public.drivers
for update
to authenticated
using (private.can_supervise())
with check (private.can_supervise());

create policy "service_requests_select_authenticated_app_users"
on public.service_requests
for select
to authenticated
using (private.can_read_dispatcher_data());

create policy "service_requests_insert_dispatcher_or_above"
on public.service_requests
for insert
to authenticated
with check (private.can_dispatch());

create policy "service_requests_update_dispatcher_or_above"
on public.service_requests
for update
to authenticated
using (private.can_dispatch())
with check (private.can_dispatch());

create policy "activity_logs_select_authenticated_app_users"
on public.activity_logs
for select
to authenticated
using (private.can_read_dispatcher_data());

create policy "activity_logs_insert_dispatcher_or_above"
on public.activity_logs
for insert
to authenticated
with check (
  private.can_dispatch()
  and created_by = (select auth.uid())
);

alter publication supabase_realtime add table public.service_requests;
alter publication supabase_realtime add table public.drivers;
alter publication supabase_realtime add table public.activity_logs;
