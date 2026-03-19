-- Grant full access to service_role for admin operations
grant all on public.profiles to service_role;
grant all on public.products to service_role;
grant all on public.orders to service_role;
grant all on public.order_items to service_role;
grant all on public.points_history to service_role;
grant all on public.pet_shops to service_role;

-- Also grant to authenticated for regular CRUD
grant select, insert, update on public.profiles to authenticated;
grant select on public.products to authenticated;
grant select, insert on public.orders to authenticated;
grant select, insert on public.order_items to authenticated;
grant select, insert on public.points_history to authenticated;
grant select on public.pet_shops to authenticated;
grant select on public.pet_shops to anon;
grant select on public.products to anon;

-- Seed test user profile (upsert safe)
insert into public.profiles (id, display_name, email, lang, points, referral_code)
values (
  '7dc876cd-cd47-41d2-b869-9567636d38ee',
  'Test User',
  'test@lukfuk.com',
  'EN',
  120,
  'LF-7DC876'
) on conflict (id) do nothing;
