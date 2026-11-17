create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text not null default '',
  username text not null unique check (username ~ '^[a-z0-9._-]{3,30}$'),
  role text not null default 'customer' check (role in ('customer', 'admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists profiles_username_ci_unique
on public.profiles (lower(username));

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_username_format_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_username_format_check
      check (username ~ '^[a-z0-9._-]{3,30}$');
  end if;
end;
$$;

create table if not exists public.venue_halls (
  id text primary key,
  name text not null,
  category text not null,
  price numeric(12, 2) not null default 0,
  description text not null default '',
  image_url text not null default '',
  details jsonb not null default '{}'::jsonb,
  display_order integer not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id text primary key default 'public',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id)
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text not null,
  storage_path text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.booking_enquiries (
  id uuid primary key default gen_random_uuid(),
  reference_code text not null unique,
  profile_id uuid references public.profiles (id) on delete cascade,
  customer_name text not null,
  mobile_number text not null,
  email_address text not null,
  hall_id text not null references public.venue_halls (id),
  hall_name text not null,
  hall_category text not null,
  rental_price text not null,
  event_type text not null,
  event_date date not null,
  session text not null,
  number_of_guests integer,
  additional_message text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text not null default '',
  legacy_reference text,
  submitted_at timestamptz not null default now(),
  unique (profile_id, legacy_reference)
);

alter table public.booking_enquiries
  alter column profile_id drop not null;

alter table public.profiles enable row level security;
alter table public.venue_halls enable row level security;
alter table public.site_content enable row level security;
alter table public.gallery_items enable row level security;
alter table public.booking_enquiries enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.venue_halls, public.site_content, public.gallery_items to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.venue_halls,
  public.site_content, public.gallery_items, public.booking_enquiries to authenticated;
grant insert on public.booking_enquiries to anon;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
      and is_active
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is not null and auth.uid() = old.id and not public.is_admin() then
    new.role := old.role;
    new.is_active := old.is_active;
    new.email := old.email;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_fields on public.profiles;
create trigger protect_profile_fields
before update on public.profiles
for each row execute function public.protect_profile_fields();

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_username text;
begin
  requested_username := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
    'user-' || substr(new.id::text, 1, 8)
  );
  requested_username := lower(requested_username);
  if requested_username !~ '^[a-z0-9._-]{3,30}$' then
    raise exception 'Username must be 3 to 30 characters and use letters, numbers, dots, underscores, or hyphens';
  end if;

  insert into public.profiles (id, full_name, email, phone, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    requested_username
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.create_profile_for_new_user();

drop policy if exists "Profiles can be read by owner or admin" on public.profiles;
create policy "Profiles can be read by owner or admin"
on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Profiles can be updated by owner or admin" on public.profiles;
create policy "Profiles can be updated by owner or admin"
on public.profiles for update to authenticated
using (id = (select auth.uid()) or (select public.is_admin()))
with check (id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "Active halls are publicly readable" on public.venue_halls;
create policy "Active halls are publicly readable"
on public.venue_halls for select to anon, authenticated
using (is_active or (select public.is_admin()));

drop policy if exists "Admins manage halls" on public.venue_halls;
create policy "Admins manage halls"
on public.venue_halls for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Public site content is readable" on public.site_content;
create policy "Public site content is readable"
on public.site_content for select to anon, authenticated
using (id = 'public' or (select public.is_admin()));

drop policy if exists "Admins manage site content" on public.site_content;
create policy "Admins manage site content"
on public.site_content for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Gallery is publicly readable" on public.gallery_items;
create policy "Gallery is publicly readable"
on public.gallery_items for select to anon, authenticated
using (true);

drop policy if exists "Admins manage gallery" on public.gallery_items;
create policy "Admins manage gallery"
on public.gallery_items for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Users read own enquiries and admins read all" on public.booking_enquiries;
create policy "Users read own enquiries and admins read all"
on public.booking_enquiries for select to authenticated
using (
  (profile_id = (select auth.uid()) and exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and is_active
  ))
  or (select public.is_admin())
);

drop policy if exists "Users submit own pending enquiries" on public.booking_enquiries;
create policy "Users submit own pending enquiries"
on public.booking_enquiries for insert to authenticated
with check (
  profile_id = (select auth.uid())
  and status = 'pending'
  and exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and is_active
  )
  and exists (
    select 1 from public.venue_halls
    where venue_halls.id = booking_enquiries.hall_id and venue_halls.is_active
  )
);

drop policy if exists "Guests submit pending enquiries" on public.booking_enquiries;
create policy "Guests submit pending enquiries"
on public.booking_enquiries for insert to anon
with check (
  profile_id is null
  and status = 'pending'
  and length(trim(customer_name)) between 2 and 100
  and length(regexp_replace(mobile_number, '[^0-9]', '', 'g')) between 7 and 15
  and length(email_address) <= 254
  and (
    email_address = ''
    or email_address ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  )
  and exists (
    select 1 from public.venue_halls
    where venue_halls.id = booking_enquiries.hall_id and venue_halls.is_active
  )
);

drop policy if exists "Admins update booking enquiries" on public.booking_enquiries;
create policy "Admins update booking enquiries"
on public.booking_enquiries for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

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
  if new_status not in ('approved', 'rejected') then
    raise exception 'Decision must be approved or rejected';
  end if;

  select * into target
  from public.booking_enquiries
  where id = booking_id
  for update;

  if not found then
    raise exception 'Booking enquiry not found';
  end if;
  if target.status <> 'pending' then
    raise exception 'Only pending enquiries can be decided';
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
      raise exception 'This hall already has an approved booking for the selected date and session';
    end if;
  end if;

  update public.booking_enquiries
  set status = new_status, admin_note = coalesce(decision_note, '')
  where id = booking_id;
end;
$$;

revoke all on function public.admin_decide_booking(uuid, text, text) from public;
grant execute on function public.admin_decide_booking(uuid, text, text) to authenticated;

drop function if exists public.get_approved_booking_slots();
create function public.get_approved_booking_slots()
returns table (hall_id text, event_date date, session text)
language sql
stable
security definer
set search_path = public
as $$
  select booking.hall_id, booking.event_date, booking.session
  from public.booking_enquiries as booking
  where booking.status = 'approved';
$$;

revoke all on function public.get_approved_booking_slots() from public;
grant execute on function public.get_approved_booking_slots() to anon, authenticated;

insert into public.site_content (id, content)
values (
  'public',
  jsonb_build_object(
    'heroKicker', 'TRADITION • CULTURE • CELEBRATION',
    'heroTagline', 'A Beautiful Place for Celebrations, Gatherings & Memories.',
    'aboutTitle', 'A Landmark of Culture & Hospitality in Guruvayankere',
    'aboutIntro', 'Buntara Bhavana – Guruvayankere stands as a proud symbol of Tulunadu cultural heritage, community unity, and gracious South Indian hospitality.',
    'aboutDetails', 'Located in the heart of Guruvayankere, Belthangady Taluk, our venue brings families and communities together to celebrate life''s most cherished milestones.',
    'hallsTitle', 'THREE DISTINCTIVE SPACES',
    'hallsSubtitle', 'One Place for Every Celebration',
    'facilitiesIntro', 'Buntara Bhavana – Guruvayankere offers confirmed halls and essential guest amenities.',
    'eventsTitle', 'Auspicious Celebrations Hosted at Buntara Bhavana',
    'contactAddress', 'Guruvayankere, Belthangady Taluk, Dakshina Kannada District, Karnataka',
    'contactPhone', '+91 8256 232 456',
    'contactEmail', 'office@buntarabhavanaguruvayankere.in',
    'officeHours', '9:30 AM – 6:00 PM',
    'events', jsonb_build_array(
      jsonb_build_object('title', 'Traditional Weddings & Receptions', 'desc', 'Grand Tulunadu and South Indian wedding ceremonies hosted with timeless elegance.'),
      jsonb_build_object('title', 'Engagements & Naming Ceremonies', 'desc', 'Intimate family milestones celebrated in our welcoming halls.'),
      jsonb_build_object('title', 'Cultural & Community Programs', 'desc', 'Yakshagana performances, cultural festivals, and community gatherings.'),
      jsonb_build_object('title', 'Conferences & Social Functions', 'desc', 'Well-organized conventions, felicitation ceremonies, and family reunions.')
    ),
    'facilities', jsonb_build_array(
      jsonb_build_object('id', 'fac-ac', 'title', 'Malady Tunga and Mundappa Shetty Vedike – AC Hall', 'subtitle', 'Premier Air-Conditioned Main Hall', 'description', 'Our flagship air-conditioned venue crafted for grand weddings, receptions, and auspicious celebrations.'),
      jsonb_build_object('id', 'fac-nonac', 'title', 'Kaashi Shetty Vedike – Non-AC Hall', 'subtitle', 'Traditional Cultural & Function Hall', 'description', 'An expansive, naturally airy hall tailored for traditional ceremonies, cultural programs, and family gatherings.'),
      jsonb_build_object('id', 'fac-mini', 'title', 'Arvaguthu K. Narayana Rai Vedike – Mini Hall', 'subtitle', 'Intimate Celebrations & Gatherings', 'description', 'A compact, elegant venue ideal for engagement ceremonies, naming ceremonies, and family meetings.'),
      jsonb_build_object('id', 'fac-parking', 'title', 'Parking Facility', 'subtitle', 'Convenient Guest Parking', 'description', 'Dedicated parking area within the premises for guests and event visitors.'),
      jsonb_build_object('id', 'fac-lift', 'title', 'Lift Facility', 'subtitle', 'Easy Multi-Floor Accessibility', 'description', 'Convenient lift access for senior citizens, elderly guests, and effortless movement across floors.'),
      jsonb_build_object('id', 'fac-dining', 'title', 'Dining Facility', 'subtitle', 'Dedicated Traditional Dining Hall', 'description', 'Spacious separate dining facility designed for comfortable traditional South Indian hospitality.')
    )
  )
)
on conflict (id) do nothing;

insert into public.venue_halls (
  id, name, category, price, description, image_url, details, display_order
)
values
(
  'malady-tunga',
  'MALADY TUNGA AND MUNDAPPA SHETTY VEDIKE',
  'AC HALL',
  75000,
  'Experience grand celebrations in an elegant, fully air-conditioned indoor venue that beautifully reflects the traditional Tulunadu and South Indian ambience.',
  './malady.jpg',
  jsonb_build_object(
    'timings', jsonb_build_object('morning', 'Morning: 10:00 AM – 2:30 PM', 'evening', 'Evening: 6:00 PM – 10:00 PM', 'note', 'Celebrate your special occasions with tradition, elegance and comfort at Buntara Bhavana.'),
    'highlights', jsonb_build_array('Fully air-conditioned grand celebration hall', 'Separate dining hall facility for guests', 'Convenient lift facility for easy accessibility', 'Parking facilities for visitors', 'Spacious and comfortable seating arrangements'),
    'suitableEvents', jsonb_build_array('Grand Weddings & Receptions', 'Engagement Ceremonies', 'Major Family Celebrations', 'Traditional & Community Occasions')
  ),
  0
),
(
  'kaashi-shetty',
  'KAASHI SHETTY VEDIKE',
  'NON-AC HALL',
  35000,
  'Spacious and well-ventilated traditional Non-AC hall offering natural ventilation for guest comfort and heritage-inspired Tulunadu ambience.',
  './kaashi%20hall.jpg',
  jsonb_build_object(
    'timings', jsonb_build_object('morning', 'Morning Session', 'evening', 'Evening Session', 'note', 'Spacious Non-AC hall with natural ventilation and dedicated guest amenities.'),
    'highlights', jsonb_build_array('Spacious and well-ventilated traditional Non-AC hall', 'Natural ventilation for guest comfort', 'Separate dining hall for guests', 'Convenient lift access', 'Parking space available'),
    'suitableEvents', jsonb_build_array('Weddings and receptions', 'Engagement ceremonies', 'Family gatherings', 'Cultural programmes', 'Traditional and community functions')
  ),
  1
),
(
  'arvaguthu-mini',
  'ARVAGUTHU K. NARAYANA RAI VEDIKE',
  'MINI HALL',
  12000,
  'A beautifully maintained mini hall offering an elegant and welcoming atmosphere for intimate family celebrations and traditional occasions. With convenient dining hall access, it provides a comfortable experience for smaller gatherings.',
  './arva.jpeg',
  jsonb_build_object(
    'timings', jsonb_build_object('morning', 'Morning Session: 8:00 AM – 3:00 PM', 'evening', 'Evening Session: 6:00 PM – 10:30 PM', 'note', 'Timings should be confirmed with the management before final scheduling.'),
    'highlights', jsonb_build_array('Compact, elegant and comfortable setting for small gatherings', 'Convenient access to the dining hall', 'Comfortable arrangements for guests', 'Suitable for small-scale events and celebrations'),
    'suitableEvents', jsonb_build_array('Engagement ceremonies', 'Naming ceremonies', 'Birthday celebrations', 'Family meetings', 'Small traditional functions')
  ),
  2
)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('venue-gallery', 'venue-gallery', true)
on conflict (id) do nothing;

drop policy if exists "Gallery images are publicly readable" on storage.objects;
create policy "Gallery images are publicly readable"
on storage.objects for select to anon, authenticated
using (bucket_id = 'venue-gallery');

drop policy if exists "Admins upload gallery images" on storage.objects;
create policy "Admins upload gallery images"
on storage.objects for insert to authenticated
with check (bucket_id = 'venue-gallery' and (select public.is_admin()));

drop policy if exists "Admins update gallery images" on storage.objects;
create policy "Admins update gallery images"
on storage.objects for update to authenticated
using (bucket_id = 'venue-gallery' and (select public.is_admin()))
with check (bucket_id = 'venue-gallery' and (select public.is_admin()));

drop policy if exists "Admins delete gallery images" on storage.objects;
create policy "Admins delete gallery images"
on storage.objects for delete to authenticated
using (bucket_id = 'venue-gallery' and (select public.is_admin()));
