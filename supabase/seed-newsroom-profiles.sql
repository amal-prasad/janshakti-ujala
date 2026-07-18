-- Paste-UUID variant: use this if you created the two test users via the
-- Supabase dashboard (Authentication → Users → Add user) instead of the
-- auth.users insert script. Copy each user's UUID from that screen and
-- paste below, then run in SQL Editor.

insert into public.profiles (id, role, display_name) values
  ('<reporter-uuid>', 'reporter', 'रिपोर्टर टेस्ट'),
  ('<editor-uuid>',   'editor',   'संपादक टेस्ट')
on conflict (id) do update set role = excluded.role, display_name = excluded.display_name;
