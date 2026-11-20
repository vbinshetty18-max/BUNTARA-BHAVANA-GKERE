drop policy if exists "Guests submit pending enquiries" on public.booking_enquiries;
drop policy if exists "Users submit own pending enquiries" on public.booking_enquiries;
drop policy if exists "Users submit own confirmed bookings and legacy requests" on public.booking_enquiries;

create policy "Users submit own confirmed bookings and legacy requests"
on public.booking_enquiries for insert to authenticated
with check (
  profile_id = (select auth.uid())
  and (
    status = 'approved'
    or (status = 'pending' and legacy_reference is not null)
  )
  and exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and is_active
  )
  and exists (
    select 1 from public.venue_halls
    where venue_halls.id = booking_enquiries.hall_id and venue_halls.is_active
  )
);

revoke insert on public.booking_enquiries from anon;

create or replace function public.prevent_duplicate_booking_date()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status in ('pending', 'approved') then
    perform pg_advisory_xact_lock(hashtext(new.event_date::text));
    if exists (
      select 1
      from public.booking_enquiries existing
      where existing.event_date = new.event_date
        and existing.status in ('pending', 'approved')
        and existing.id is distinct from new.id
    ) then
      raise exception using
        errcode = '23505',
        message = 'The selected date is already booked.';
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.prevent_duplicate_booking_date() from public, anon, authenticated;

drop trigger if exists prevent_duplicate_booking_date on public.booking_enquiries;
create trigger prevent_duplicate_booking_date
before insert or update of event_date, status on public.booking_enquiries
for each row execute function public.prevent_duplicate_booking_date();

drop function if exists public.get_approved_booking_slots();
drop function if exists public.get_unavailable_booking_dates();
create function public.get_unavailable_booking_dates()
returns table (event_date date)
language sql
stable
security definer
set search_path = public
as $$
  select distinct booking.event_date
  from public.booking_enquiries as booking
  where booking.status in ('pending', 'approved');
$$;

revoke all on function public.get_unavailable_booking_dates() from public;
grant execute on function public.get_unavailable_booking_dates() to anon, authenticated;
