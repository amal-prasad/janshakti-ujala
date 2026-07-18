-- Test accounts for /newsroom. Run once in Supabase SQL Editor (real project only —
-- the embedded-postgres auth.users shim in migration 011 has no password/identity
-- columns, so this does NOT run under `npm run db:verify`).
--
-- Inserts directly into auth.users/auth.identities, bypassing GoTrue signup — a
-- standard Supabase seeding pattern, fine for test accounts. Change the passwords
-- before using this against anything but a throwaway/dev project.

do $$
declare
  reporter_id uuid;
  editor_id uuid;
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data
  ) values (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
    'authenticated', 'authenticated',
    'reporter@test.local', crypt('reporter-test-pw', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}'
  )
  on conflict (email) do nothing
  returning id into reporter_id;

  if reporter_id is null then
    select id into reporter_id from auth.users where email = 'reporter@test.local';
  end if;

  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider, created_at, updated_at
  ) values (
    gen_random_uuid(), reporter_id, reporter_id::text,
    jsonb_build_object('sub', reporter_id::text, 'email', 'reporter@test.local'),
    'email', now(), now()
  )
  on conflict do nothing;

  insert into public.profiles (id, role, display_name)
  values (reporter_id, 'reporter', 'रिपोर्टर टेस्ट')
  on conflict (id) do nothing;

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data
  ) values (
    '00000000-0000-0000-0000-000000000000', gen_random_uuid(),
    'authenticated', 'authenticated',
    'editor@test.local', crypt('editor-test-pw', gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}', '{}'
  )
  on conflict (email) do nothing
  returning id into editor_id;

  if editor_id is null then
    select id into editor_id from auth.users where email = 'editor@test.local';
  end if;

  insert into auth.identities (
    id, user_id, provider_id, identity_data, provider, created_at, updated_at
  ) values (
    gen_random_uuid(), editor_id, editor_id::text,
    jsonb_build_object('sub', editor_id::text, 'email', 'editor@test.local'),
    'email', now(), now()
  )
  on conflict do nothing;

  insert into public.profiles (id, role, display_name)
  values (editor_id, 'editor', 'संपादक टेस्ट')
  on conflict (id) do nothing;
end $$;

-- Login at /newsroom/login with:
--   reporter@test.local / reporter-test-pw
--   editor@test.local   / editor-test-pw
