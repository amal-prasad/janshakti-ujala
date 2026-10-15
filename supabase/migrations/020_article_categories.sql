-- Multi-section articles. `category` stays the primary section (card badge,
-- breadcrumb, related articles); `categories` lists every section the article
-- appears in, primary included — e.g. {indore, madhya-pradesh, rajneeti}.
-- Section pages match `category = X or X = any(categories)`, so a row inserted
-- in Studio with only `category` set still shows in its section.
alter table public.articles add column if not exists categories text[] not null default '{}';

create index if not exists articles_categories_idx on public.articles using gin (categories);

-- The generic प्रदेश section is split into मध्य प्रदेश + अन्य राज्य.
update public.articles
   set category = case when state = 'मध्य प्रदेश' then 'madhya-pradesh' else 'anya-rajya' end
 where category = 'pradesh';

update public.articles
   set categories = array[category]
 where categories = '{}';
