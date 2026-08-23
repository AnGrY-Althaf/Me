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

Add an entry to the top of `BLOG` in [content.ts](content.ts):

```ts
{
  date: '2026-06-01',          // ISO; rendered as 2026.6.1, sorted newest first
  title: '...',
  summary: '...',              // shown when the row is expanded
  author: PROFILE.name,
  topics: ['Bug Bounty', 'XSS'],
  href: 'https://...',
}
```

Topics build the filter rail automatically, with counts. Reuse existing topic
strings rather than near-duplicates — `XSS`, not `Cross-Site Scripting` — or
they will list as separate filters.

## Cross-links

Nav targets live in `SITE` and `NAV` in [content.ts](content.ts). The bracketed
letters in the top rail are real keyboard shortcuts.
