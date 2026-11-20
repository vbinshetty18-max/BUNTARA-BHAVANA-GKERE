-- Migration: Add 'cancelled' status to booking_enquiries and support admin cancellation

-- 1. Update check constraint on status column to include 'cancelled'
alter table public.booking_enquiries drop constraint if exists booking_enquiries_status_check;
alter table public.booking_enquiries add constraint booking_enquiries_status_check
  check (status in ('pending', 'approved', 'rejected', 'cancelled'));

-- 2. Update admin_decide_booking RPC function to allow 'approved', 'rejected', and 'cancelled'
create or replace function public.admin_decide_booking(
  booking_id uuid,
  new_status text,
  decision_note text default ''
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target public.booking_enquiries%rowtype;
begin
  if not public.is_admin() then
    raise exception 'Administrator access required';
  end if;
  if new_status not in ('approved', 'rejected', 'cancelled') then
    raise exception 'Decision must be approved, rejected, or cancelled';
  end if;

  select * into target
  from public.booking_enquiries
  where id = booking_id
  for update;

  if not found then
    raise exception 'Booking enquiry not found';
  end if;

  if new_status = 'approved' then
    perform pg_advisory_xact_lock(hashtext(target.hall_id), hashtext(target.event_date::text));
    if exists (
      select 1
      from public.booking_enquiries existing
      where existing.id <> booking_id
        and existing.hall_id = target.hall_id
        and existing.event_date = target.event_date
        and existing.status = 'approved'
        and (
          existing.session = 'Full-Day Session'
          or target.session = 'Full-Day Session'
          or existing.session = target.session
        )
    ) then
      raise exception 'Hall is already approved for that date and session';
    end if;
  end if;

  update public.booking_enquiries
  set status = new_status,
      admin_note = coalesce(decision_note, '')
  where id = booking_id;
end;
$$;
