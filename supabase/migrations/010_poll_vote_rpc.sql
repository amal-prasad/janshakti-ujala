-- Atomic vote counter. SECURITY DEFINER so it can write under RLS — poll_options has
-- no anon write policy, so votes must go through the service-role /api/polls/vote route.
create or replace function public.increment_poll_vote(option_id uuid)
returns void language sql security definer set search_path = public as $$
  update public.poll_options set vote_count = vote_count + 1 where id = option_id;
$$;
