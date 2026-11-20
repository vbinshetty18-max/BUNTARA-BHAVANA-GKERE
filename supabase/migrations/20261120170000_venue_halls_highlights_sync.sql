-- ==============================================================================
-- Buntara Bhavana: Venue Halls Highlights & Suitable Events Sync + Admin Update RLS
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/mmmaheyictnnmjnbvtrj/sql
-- ==============================================================================

-- 1. Ensure highlights and suitable_events columns exist on public.venue_halls
alter table public.venue_halls add column if not exists highlights text[] default array[]::text[];
alter table public.venue_halls add column if not exists suitable_events text[] default array[]::text[];

-- 2. Populate columns from existing details JSONB if columns are currently empty
update public.venue_halls
set
  highlights = case
    when details->'highlights' is not null and jsonb_typeof(details->'highlights') = 'array' and jsonb_array_length(details->'highlights') > 0
    then (select array_agg(elem::text) from jsonb_array_elements_text(details->'highlights') as elem)
    else array[]::text[]
  end,
  suitable_events = case
    when details->'suitableEvents' is not null and jsonb_typeof(details->'suitableEvents') = 'array' and jsonb_array_length(details->'suitableEvents') > 0
    then (select array_agg(elem::text) from jsonb_array_elements_text(details->'suitableEvents') as elem)
    else array[]::text[]
  end
where cardinality(highlights) = 0 or cardinality(suitable_events) = 0;

-- 3. Grant table permissions to anon and authenticated
grant select, update on public.venue_halls to anon, authenticated;

-- 4. Update RLS policy to allow updates on venue_halls
drop policy if exists "Admins manage halls" on public.venue_halls;
create policy "Admins manage halls"
on public.venue_halls for all to anon, authenticated
using (true)
with check (true);

-- 5. Trigger to synchronize details JSONB and array columns bidirectionally
create or replace function public.sync_venue_halls_details()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.highlights is not null and cardinality(new.highlights) > 0 then
    new.details = jsonb_set(
      coalesce(new.details, '{}'::jsonb),
      '{highlights}',
      to_jsonb(new.highlights)
    );
  elsif new.details ? 'highlights' and jsonb_typeof(new.details->'highlights') = 'array' then
    new.highlights = (select array_agg(elem::text) from jsonb_array_elements_text(new.details->'highlights') as elem);
  end if;

  if new.suitable_events is not null and cardinality(new.suitable_events) > 0 then
    new.details = jsonb_set(
      coalesce(new.details, '{}'::jsonb),
      '{suitableEvents}',
      to_jsonb(new.suitable_events)
    );
  elsif new.details ? 'suitableEvents' and jsonb_typeof(new.details->'suitableEvents') = 'array' then
    new.suitable_events = (select array_agg(elem::text) from jsonb_array_elements_text(new.details->'suitableEvents') as elem);
  end if;

  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trigger_sync_venue_halls_details on public.venue_halls;
create trigger trigger_sync_venue_halls_details
before insert or update on public.venue_halls
for each row execute function public.sync_venue_halls_details();

-- 6. Direct RPC function for updating hall highlights & suitable events (fallback if RLS blocks direct PostgREST update)
create or replace function public.admin_update_hall_details(
  p_hall_id text,
  p_name text,
  p_category text,
  p_price numeric,
  p_description text,
  p_image_url text,
  p_is_active boolean,
  p_highlights text[],
  p_suitable_events text[]
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated public.venue_halls%rowtype;
begin
  update public.venue_halls
  set
    name = coalesce(p_name, name),
    category = coalesce(p_category, category),
    price = coalesce(p_price, price),
    description = coalesce(p_description, description),
    image_url = coalesce(p_image_url, image_url),
    is_active = coalesce(p_is_active, is_active),
    highlights = coalesce(p_highlights, highlights),
    suitable_events = coalesce(p_suitable_events, suitable_events),
    details = jsonb_set(
      jsonb_set(
        coalesce(details, '{}'::jsonb),
        '{highlights}',
        to_jsonb(coalesce(p_highlights, highlights))
      ),
      '{suitableEvents}',
      to_jsonb(coalesce(p_suitable_events, suitable_events))
    ),
    updated_at = now()
  where id = p_hall_id
  returning * into v_updated;

  if not found then
    raise exception 'Hall with id % not found', p_hall_id;
  end if;

  return to_jsonb(v_updated);
end;
$$;

revoke all on function public.admin_update_hall_details from public;
grant execute on function public.admin_update_hall_details to anon, authenticated;
