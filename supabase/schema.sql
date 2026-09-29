
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Submissions table
create table if not exists submissions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  relationship text not null,
  category text not null check (category in ('family', 'friends', 'church', 'school_work', 'other')),
  message text not null,
  memory text,
  wish text,
  photo_1_url text,
  photo_2_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  animation_style text check (animation_style in ('polaroid', 'split')),
  display_order integer,
  created_at timestamptz not null default now()
);

-- Row-level security
alter table submissions enable row level security;

-- Public can insert (contribute form)
create policy "Anyone can submit"
  on submissions for insert
  to anon
  with check (true);

-- No public reads (all reads go through service role)
-- Admin reads go through service role key (API routes)

-- Storage bucket
insert into storage.buckets (id, name, public)
  values ('denisha-memories', 'denisha-memories', false)
  on conflict do nothing;

-- Only service role can access storage (enforced via API routes)
