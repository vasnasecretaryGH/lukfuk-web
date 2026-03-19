create or replace function public.increment_points(uid uuid, delta integer)
returns void language sql security definer as $$
  update public.profiles set points = points + delta where id = uid;
$$;
