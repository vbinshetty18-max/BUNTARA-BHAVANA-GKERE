-- Migration: Allow public visitors to submit booking enquiries directly without authentication
-- Enables visitors on the public site to submit hall bookings that appear directly on the Administration dashboard for review.

drop policy if exists "Guests submit pending enquiries" on public.booking_enquiries;
drop policy if exists "Users submit own confirmed bookings and legacy requests" on public.booking_enquiries;

create policy "Guests submit pending enquiries"
on public.booking_enquiries for insert to anon, authenticated
with check (
  status = 'pending'
  and length(trim(customer_name)) between 2 and 100
  and length(regexp_replace(mobile_number, '[^0-9]', '', 'g')) between 7 and 15
  and length(email_address) <= 254
  and exists (
    select 1 from public.venue_halls
    where venue_halls.id = booking_enquiries.hall_id and venue_halls.is_active
  )
);

grant insert on public.booking_enquiries to anon;
