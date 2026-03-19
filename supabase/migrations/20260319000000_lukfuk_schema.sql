-- ─────────────────────────────────────────────
-- LUKFUK.BKK — Initial Schema
-- ─────────────────────────────────────────────

-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text not null,
  email text,
  phone text,
  lang text not null default 'TH',
  points integer not null default 0,
  referral_code text unique,
  referred_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_th text not null,
  desc_en text,
  desc_th text,
  price integer not null,
  category text not null check (category in ('house','scratcher','combo')),
  images text[] default '{}',
  dimensions text,
  material text,
  stock integer not null default 0,
  is_new_collection boolean default false,
  badge text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) not null,
  subtotal integer not null,
  shipping_fee integer not null default 0,
  points_used integer not null default 0,
  total integer not null,
  status text not null default 'confirmed'
    check (status in ('confirmed','packed','shipped','delivered')),
  courier text,
  tracking_number text,
  payment_method text not null,
  address jsonb not null,
  created_at timestamptz default now()
);

-- Order Items
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id),
  name text not null,
  price integer not null,
  qty integer not null,
  image text
);

-- Points History
create table public.points_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) not null,
  type text not null
    check (type in ('earned','redeemed','bonus','referral','expired','adjusted')),
  amount integer not null,
  description text not null,
  order_id uuid references public.orders(id),
  created_at timestamptz default now()
);

-- Pet Shops
create table public.pet_shops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  district text,
  province text,
  lat double precision,
  lng double precision,
  phone text,
  hours text,
  created_at timestamptz default now()
);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.points_history enable row level security;
alter table public.pet_shops enable row level security;

-- Profiles: users can read/update their own
create policy "profiles: own read" on public.profiles for select using (auth.uid() = id);
create policy "profiles: own update" on public.profiles for update using (auth.uid() = id);
create policy "profiles: insert on signup" on public.profiles for insert with check (auth.uid() = id);

-- Products: public read, admin write (handled via service role in admin panel)
create policy "products: public read" on public.products for select using (is_active = true);

-- Orders: users see their own
create policy "orders: own read" on public.orders for select using (auth.uid() = user_id);
create policy "orders: own insert" on public.orders for insert with check (auth.uid() = user_id);

-- Order items: users see their own via order
create policy "order_items: own read" on public.order_items for select
  using (exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));
create policy "order_items: own insert" on public.order_items for insert
  with check (exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));

-- Points history: own read
create policy "points_history: own read" on public.points_history for select using (auth.uid() = user_id);

-- Pet shops: public read
create policy "pet_shops: public read" on public.pet_shops for select using (true);

-- ─────────────────────────────────────────────
-- TRIGGER: auto-create profile on signup
-- ─────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name, email, phone, referral_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', 'Cat Parent'),
    new.email,
    new.phone,
    'LF-' || upper(substring(new.id::text, 1, 6))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────────
-- SEED: Pet Shops
-- ─────────────────────────────────────────────

insert into public.pet_shops (name, address, district, province, phone, hours, lat, lng) values
  ('Art Flagship House', '123 Sukhumvit Soi 10', 'Khlong Toei', 'Bangkok', '02-123-4567', '10:00–21:00', 13.7440, 100.5605),
  ('Sukhumvit & JP Garden', '45 Sukhumvit Soi 22', 'Khlong Toei', 'Bangkok', '02-234-5678', '09:00–20:00', 13.7200, 100.5630),
  ('Thong Lo Creative District', '88 Thong Lo Soi 5', 'Watthana', 'Bangkok', '02-345-6789', '11:00–21:00', 13.7246, 100.5800),
  ('Paw Parlour Ari', '12 Ari Soi 4', 'Phaya Thai', 'Bangkok', '02-456-7890', '10:00–20:00', 13.7794, 100.5479),
  ('The Cat Maker Ekkamai', '33 Ekkamai Soi 10', 'Watthana', 'Bangkok', '02-567-8901', '10:00–21:00', 13.7178, 100.5850),
  ('Paw Select On Nut', '200 On Nut Road', 'Suan Luang', 'Bangkok', '02-678-9012', '09:00–19:00', 13.7006, 100.6011);

-- ─────────────────────────────────────────────
-- SEED: Products
-- ─────────────────────────────────────────────

insert into public.products (name_en, name_th, desc_en, desc_th, price, category, stock, is_new_collection, badge) values
  ('The Luk Evora', 'เดอะ ลูก อีวอร่า', 'A minimalist cat house inspired by Bauhaus architecture.', 'บ้านแมวสไตล์มินิมอล', 1290, 'house', 14, false, 'Best Seller'),
  ('Zig Zag Scratcher', 'ซิก แซก สแครชเชอร์', 'A sculptural wave scratcher that doubles as a lounger.', 'แผ่นข่วนเล็บทรงคลื่น', 890, 'scratcher', 6, true, 'New'),
  ('CatHat Cave', 'แคทแฮท เคฟ', 'A cozy igloo-style cave for cats who love to hide.', 'บ้านแมวสไตล์อิกลู', 1490, 'house', 0, false, null),
  ('Luk Tower Combo', 'ลูก ทาวเวอร์ คอมโบ', 'A 3-tier activity tower with scratcher base and hideout.', 'หอกิจกรรม 3 ชั้น', 2190, 'combo', 4, true, 'New'),
  ('Zen Ceramic Feeder Set', 'เซน เซรามิก ฟีดเดอร์ เซ็ต', 'Elevated ceramic feeding bowls on a bamboo stand.', 'ชุดชามเซรามิกยกสูง', 1290, 'combo', 22, false, null),
  ('Bamboo Sisal Scratcher', 'แบมบู ไซซัล สแครชเชอร์', 'Flat lounge scratcher from natural sisal fibre.', 'แผ่นข่วนเล็บไซซัลธรรมชาติ', 750, 'scratcher', 3, false, null);
