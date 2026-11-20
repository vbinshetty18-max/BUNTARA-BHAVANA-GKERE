-- ==============================================================================
-- Buntara Bhavana: Hall-Specific Availability, Constraint Cleanup & Admin Delete RLS
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/mmmaheyictnnmjnbvtrj/sql
-- ==============================================================================

-- 1. DROP ANY SINGLE-COLUMN UNIQUE CONSTRAINTS OR INDEXES ON event_date ALONE
--    (Prevents database from blocking different halls on the same date)
alter table public.booking_enquiries drop constraint if exists booking_enquiries_event_date_key;
alter table public.booking_enquiries drop constraint if exists booking_enquiries_event_date_unique;
drop index if exists public.booking_enquiries_event_date_idx;
drop index if exists public.booking_enquiries_event_date_unique;

-- 2. REPLACE GLOBAL DATE LOCK TRIGGER WITH SPECIFIC (hall_id + event_date) TRIGGER
--    (Allows Hall 1, Hall 2, Hall 3 to be booked independently on the exact same date)
drop trigger if exists prevent_duplicate_booking_date on public.booking_enquiries;
drop function if exists public.prevent_duplicate_booking_date();

create or replace function public.prevent_duplicate_booking_date()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status in ('pending', 'approved') then
    -- Lock specifically on the combination of hall_id and event_date
    perform pg_advisory_xact_lock(hashtext(new.hall_id), hashtext(new.event_date::text));
    if exists (
      select 1
      from public.booking_enquiries existing
      where existing.hall_id = new.hall_id
        and existing.event_date = new.event_date
        and existing.status in ('pending', 'approved')
        and existing.id is distinct from new.id
    ) then
      raise exception using
        errcode = '23505',
        message = 'This hall is already booked on the selected date.';
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.prevent_duplicate_booking_date() from public, anon, authenticated;

create trigger prevent_duplicate_booking_date
before insert or update of hall_id, event_date, status on public.booking_enquiries
for each row execute function public.prevent_duplicate_booking_date();

-- 3. UPDATE AVAILABILITY FUNCTION TO INCLUDE BOTH PENDING AND APPROVED SLOTS
drop function if exists public.get_approved_booking_slots();
create or replace function public.get_approved_booking_slots()
returns table (hall_id text, event_date date, session text)
language sql
stable
security definer
set search_path = public
as $$
  select booking.hall_id, booking.event_date, booking.session
  from public.booking_enquiries as booking
  where booking.status in ('pending', 'approved');
$$;

revoke all on function public.get_approved_booking_slots() from public;
grant execute on function public.get_approved_booking_slots() to anon, authenticated;

-- 4. GRANT TABLE DELETE PERMISSION AND ADD RLS DELETE POLICY FOR ADMINS
grant delete on public.booking_enquiries to authenticated;

drop policy if exists "Admins delete booking enquiries" on public.booking_enquiries;
create policy "Admins delete booking enquiries"
on public.booking_enquiries for delete to authenticated
using ((select public.is_admin()));

-- 5. ENSURE ADMIN SELECT POLICY (REQUIRED FOR PostgREST .select() AFTER .delete())
drop policy if exists "Users read own enquiries and admins read all" on public.booking_enquiries;
create policy "Users read own enquiries and admins read all"
on public.booking_enquiries for select to authenticated
using (
  profile_id = (select auth.uid())
  or (select public.is_admin())
);

-- 6. ADMIN DELETE RPC FUNCTION (FALLBACK FOR BULK / INDIVIDUAL DELETION)
create or replace function public.admin_delete_bookings(booking_ids uuid[])
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Administrator access required';
  end if;

  delete from public.booking_enquiries
  where id = any(booking_ids);
end;
$$;

revoke all on function public.admin_delete_bookings(uuid[]) from public;
grant execute on function public.admin_delete_bookings(uuid[]) to authenticated;

-- 7. COMPATIBILITY VIEW (Supports queries targeting 'public.bookings')
create or replace view public.bookings as
select * from public.booking_enquiries;
