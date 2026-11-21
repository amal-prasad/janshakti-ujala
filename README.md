This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Article social posts

In `/newsroom/new` or the article editor, place the cursor in the article body,
paste a public post URL into **सोशल मीडिया पोस्ट जोड़ें**, and click **पोस्ट जोड़ें**.
The preview and published article share the same renderer. A supported URL on its
own paragraph (blank lines before and after) also becomes an embed.

Supported: Instagram posts/Reels, X/Twitter status links and YouTube videos/Shorts.
Private, deleted or embed-disabled posts may not display; the original post link
remains available. Arbitrary embed HTML and scripts are not accepted. No social
account credentials or API keys are needed. Provider scripts load as posts
approach the viewport; YouTube uses its privacy-enhanced embed player.

## Category order and the Indore merge

`src/lib/categories.ts` is the shared order for navigation, homepage sections,
editor choices and sitemap links. The homepage skips categories with no stories.
Indore coverage belongs to Madhya Pradesh; city datelines remain unchanged.
`/shreni/indore` permanently redirects to `/shreni/madhya-pradesh`.

For existing databases, apply
`supabase/migrations/20261121121326_merge_indore_into_madhya_pradesh.sql`.
It preserves article URLs, content, publication state and timestamps, retains
other category memberships and can be run repeatedly. `supabase/setup.sql`
includes the same operation for full setups.

The alternative hosted backfill uses the existing server-only credentials in
`.env.local`: `node scripts/migrate-indore.mts` is read-only;
`node scripts/migrate-indore.mts --apply` saves a local ignored backup before
updating rows and stops on concurrent edits. Do not put the service key in browser code.

Checks: `npm run test:utils`, `npm run test:content`, `npm run db:verify`,
`npm run lint`, and `npm run build`.
