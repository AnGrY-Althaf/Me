# blog.althafthehacker.com

The blog, as a standalone site. Lives on the `blog` branch; the portfolio
itself is on `simple`.

Both share one palette, type scale and theme toggle, so the apex domain and
this subdomain read as the same site. The layout is a 24-column technical
index — a topic filter rail on the left five columns, a dated table of posts
across the remaining nineteen.

## Run locally

```
npm install
npm run dev
```

## Build

```
npm run build
```

Outputs a static site to `dist/`. No server, no environment variables — point
`blog.althafthehacker.com` at that directory on any static host.

Deep links are not used, so no SPA rewrite rules are needed.

## Adding a post

Posts are hosted here, not linked out. Each one is a markdown file plus an
entry describing it.

1. Write `posts/<slug>.md` — the body only, no front matter and no `# Title`
   (the title comes from the entry below and is rendered as the page heading).
2. Add an entry to the top of `BLOG` in [content.ts](content.ts):

```ts
{
  slug: 'my-post',              // must match posts/my-post.md, and is the URL
  date: '2026-06-01',           // ISO; shown as 2026.6.1, sorted newest first
  title: '...',
  summary: '...',               // shown in the expanded row and under the title
  author: PROFILE.name,
  topics: ['Bug Bounty', 'XSS'],
  hero: '/posts/my-post.webp',  // optional, from public/posts/
  readingTime: '6 min read',
  body: body('my-post'),
}
```

The post is then live at `#/my-post`. A missing markdown file fails the build
with a named error rather than shipping an empty page.

Topics build the filter rail automatically, with counts. Reuse existing topic
strings rather than near-duplicates — `XSS`, not `Cross-Site Scripting` — or
they will list as separate filters.

Markdown supports GFM, so tables and fenced code blocks both work. Code and
tables are allowed to run wider than the text column, which is capped at a
readable measure.

## Cross-links

Nav targets live in `SITE` and `NAV` in [content.ts](content.ts). The bracketed
letters in the top rail are real keyboard shortcuts.
