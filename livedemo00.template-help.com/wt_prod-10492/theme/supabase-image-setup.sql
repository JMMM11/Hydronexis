-- HYDRONEXIS image upload setup for Supabase
-- Run this in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'hydronexis-images',
  'hydronexis-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.image_uploads (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  folder text not null check (folder in ('products', 'profiles', 'exchanges', 'sellers')),
  storage_path text not null unique,
  public_url text not null,
  record_type text not null default 'image',
  related_record_id text,
  file_name text,
  mime_type text,
  file_size integer,
  created_at timestamptz not null default now()
);

alter table public.image_uploads enable row level security;

drop policy if exists "Hydronexis public image metadata insert" on public.image_uploads;
create policy "Hydronexis public image metadata insert"
on public.image_uploads
for insert
to anon
with check (
  folder in ('products', 'profiles', 'exchanges', 'sellers')
  and storage_path like folder || '/%'
  and file_size <= 5242880
  and mime_type in ('image/jpeg', 'image/png', 'image/webp')
);

drop policy if exists "Hydronexis public image metadata read" on public.image_uploads;
create policy "Hydronexis public image metadata read"
on public.image_uploads
for select
to anon
using (true);

drop policy if exists "Hydronexis public image uploads" on storage.objects;
create policy "Hydronexis public image uploads"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'hydronexis-images'
  and (storage.foldername(name))[1] in ('products', 'profiles', 'exchanges', 'sellers')
  and lower(coalesce((metadata ->> 'mimetype'), '')) in ('image/jpeg', 'image/png', 'image/webp')
);

drop policy if exists "Hydronexis public image reads" on storage.objects;
create policy "Hydronexis public image reads"
on storage.objects
for select
to anon
using (bucket_id = 'hydronexis-images');

drop policy if exists "Hydronexis public image deletes" on storage.objects;
create policy "Hydronexis public image deletes"
on storage.objects
for delete
to anon
using (
  bucket_id = 'hydronexis-images'
  and (storage.foldername(name))[1] in ('products', 'profiles', 'exchanges', 'sellers')
);
