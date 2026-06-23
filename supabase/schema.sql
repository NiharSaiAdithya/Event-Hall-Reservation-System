-- ============================================
-- Grand Celebration Event Hall
-- Supabase Database Schema & Seed Data
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- CLEAN SLATE: Drop everything in dependency order
-- ============================================

drop table if exists admin_users cascade;
drop table if exists blocked_dates cascade;
drop table if exists business_settings cascade;
drop table if exists business_hours cascade;
drop table if exists appointments cascade;
drop table if exists services cascade;

-- ============================================
-- TABLES
-- ============================================

create table services (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null,
  duration_minutes integer not null default 60,
  price numeric(10,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table appointments (
  id uuid primary key default uuid_generate_v4(),
  service_id uuid not null references services(id) on delete cascade,
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now()
);

create table business_hours (
  id uuid primary key default uuid_generate_v4(),
  day_of_week integer not null check (day_of_week between 0 and 6),
  open_time time not null default '09:00:00',
  close_time time not null default '22:00:00',
  is_open boolean not null default true,
  unique (day_of_week)
);

create table blocked_dates (
  id uuid primary key default uuid_generate_v4(),
  blocked_date date not null unique,
  reason text,
  created_at timestamptz not null default now()
);

create table business_settings (
  id uuid primary key default uuid_generate_v4(),
  business_name text not null default 'Grand Celebration Event Hall',
  business_email text not null default 'info@grandcelebration.com',
  business_phone text not null default '(555) 123-4567',
  business_address text not null default '123 Celebration Avenue, Elegance City',
  slot_interval_minutes integer not null default 60,
  booking_notice_hours integer not null default 24,
  updated_at timestamptz not null default now()
);

create table admin_users (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  unique (user_id)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

alter table services enable row level security;
alter table appointments enable row level security;
alter table business_hours enable row level security;
alter table blocked_dates enable row level security;
alter table business_settings enable row level security;
alter table admin_users enable row level security;

create policy "Public can view active services"
  on services for select using (is_active = true);

create policy "Admin can manage services"
  on services for all
  using (exists (select 1 from admin_users where user_id = auth.uid()));

create policy "Public can create appointments"
  on appointments for insert with check (true);

create policy "Public can view appointments for availability"
  on appointments for select using (true);

create policy "Admin can view all appointments"
  on appointments for select
  using (exists (select 1 from admin_users where user_id = auth.uid()));

create policy "Admin can update appointments"
  on appointments for update
  using (exists (select 1 from admin_users where user_id = auth.uid()));

create policy "Admin can delete appointments"
  on appointments for delete
  using (exists (select 1 from admin_users where user_id = auth.uid()));

create policy "Public can view business hours"
  on business_hours for select using (true);

create policy "Admin can manage business hours"
  on business_hours for all
  using (exists (select 1 from admin_users where user_id = auth.uid()));

create policy "Public can view blocked dates"
  on blocked_dates for select using (true);

create policy "Admin can manage blocked dates"
  on blocked_dates for all
  using (exists (select 1 from admin_users where user_id = auth.uid()));

create policy "Public can view business settings"
  on business_settings for select using (true);

create policy "Admin can manage business settings"
  on business_settings for all
  using (exists (select 1 from admin_users where user_id = auth.uid()));

create policy "Admin can view admin users"
  on admin_users for select
  using (user_id = auth.uid());

-- ============================================
-- SEED DATA
-- ============================================

insert into services (name, description, duration_minutes, price, is_active) values
  ('Wedding Hall Package', 'Elegant venue for weddings and receptions with premium décor, bridal suite access, and professional event coordination.', 480, 5000, true),
  ('Birthday Celebration Package', 'Family-friendly party venue with customizable decorations, entertainment area, and dedicated celebration space.', 240, 1500, true),
  ('Corporate Event Package', 'Professional meeting and conference venue with state-of-the-art AV equipment, projectors, and business amenities.', 360, 3000, true),
  ('Engagement Ceremony Package', 'Stylish engagement celebration venue with intimate seating, photo-ready décor, and champagne service.', 300, 2500, true),
  ('Reception Event Package', 'Premium reception hall experience with banquet seating, stage setup, and gourmet catering options.', 420, 4000, true),
  ('Private Function Package', 'Flexible venue rental for special occasions including anniversaries, reunions, and exclusive gatherings.', 300, 2000, true);

insert into business_hours (day_of_week, open_time, close_time, is_open) values
  (0, '09:00:00', '22:00:00', false),
  (1, '09:00:00', '22:00:00', true),
  (2, '09:00:00', '22:00:00', true),
  (3, '09:00:00', '22:00:00', true),
  (4, '09:00:00', '22:00:00', true),
  (5, '09:00:00', '22:00:00', true),
  (6, '10:00:00', '23:00:00', true);

insert into business_settings (business_name, business_email, business_phone, business_address, slot_interval_minutes, booking_notice_hours) values
  ('Grand Celebration Event Hall', 'info@grandcelebration.com', '(555) 123-4567', '123 Celebration Avenue, Elegance City, EC 10001', 60, 24);

-- ============================================
-- ADMIN USER SETUP
-- ============================================
-- After creating a Supabase Auth user, insert into admin_users:
--
-- insert into admin_users (user_id, email)
-- values ('<your-auth-user-uuid>', 'admin@grandcelebration.com');
--
-- You can create the auth user via Supabase Dashboard > Authentication > Users
