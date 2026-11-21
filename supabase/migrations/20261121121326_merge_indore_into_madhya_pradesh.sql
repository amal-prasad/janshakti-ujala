-- Retire the Indore section without changing article URLs, bodies, publication
-- status or dates. Preserve other section memberships and deduplicate in order.
-- Safe to run again, including after the hosted REST backfill.
update public.articles as article
set category = case when article.category = 'indore' then 'madhya-pradesh' else article.category end,
    categories = array(
      select normalized
      from (
        select case when section = 'indore' then 'madhya-pradesh' else section end as normalized,
               min(position) as first_position
        from unnest(array[article.category] || article.categories) with ordinality as sections(section, position)
        group by 1
      ) as unique_sections
      order by first_position
    ),
    state = case when article.category = 'indore' or nullif(btrim(article.state), '') is null
                 then 'मध्य प्रदेश' else article.state end
where article.category = 'indore' or article.categories @> array['indore'];
