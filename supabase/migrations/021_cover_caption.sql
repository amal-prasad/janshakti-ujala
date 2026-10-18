-- Optional caption shown in italics under the article's cover photo.
alter table public.articles add column if not exists cover_image_caption text;
