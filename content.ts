export const PROFILE = {
  name: 'Althaf Shajahan',
  alias: 'AnGrY',
  role: 'Security Engineer',
  tagline: 'My notes on offensive security, bug bounty, and AI.',
  email: 'angry.althaf@gmail.com',
  linkedin: 'https://www.linkedin.com/in/althaf-shajahan-angry/',
  github: 'https://github.com/AnGrY-Althaf',
  medium: 'https://medium.com/@angry.althaf',
};

/** This blog is its own deployment; the portfolio lives on the apex domain. */
export const SITE = {
  main: 'https://althafthehacker.com',
  blog: 'https://blog.althafthehacker.com',
};

export interface NavItem {
  /** Single character shown in brackets, and the key that activates it. */
  hotkey: string;
  label: string;
  href: string;
  /** The entry for the page you are already on. */
  current?: boolean;
}

/**
 * The top rail. Everything except the blog itself points back off this
 * subdomain, so the two halves of the site stay one place to a reader.
 */
export const NAV: NavItem[] = [
  { hotkey: 'b', label: 'Blog', href: SITE.blog, current: true },
  { hotkey: 'w', label: 'whoami', href: `${SITE.main}/#/whoami` },
  { hotkey: 'e', label: 'Experience', href: `${SITE.main}/#/experience` },
  { hotkey: 'a', label: 'Arsenal', href: `${SITE.main}/#/arsenal` },
  { hotkey: 'g', label: 'GitHub', href: PROFILE.github },
  { hotkey: 'l', label: 'LinkedIn', href: PROFILE.linkedin },
  { hotkey: 'm', label: 'Medium', href: PROFILE.medium },
];

/* -------------------------------------------------------------- posts */

export interface BlogPost {
  /** Also the URL (`#/<slug>`) and the markdown filename. */
  slug: string;
  /** ISO date — sorted on, and formatted for display as YYYY.M.D. */
  date: string;
  title: string;
  /** One or two lines, shown in the expanded feed row and under the title. */
  summary: string;
  author: string;
  topics: string[];
  /** Optional banner, served from `public/posts/`. */
  hero?: string;
  /** How long the piece runs, as shown on the post page. */
  readingTime: string;
  /** Filled in below from the matching file in `posts/`. */
  body: string;
}

/**
 * Post bodies live as plain markdown in `posts/<slug>.md` and are pulled in
 * at build time, so writing a post means writing a file rather than editing
 * a TypeScript literal.
 */
const BODIES = import.meta.glob('./posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function body(slug: string): string {
  const md = BODIES[`./posts/${slug}.md`];
  if (!md) throw new Error(`No markdown found for post "${slug}" (expected posts/${slug}.md)`);
  return md;
}

/**
 * The feed. Topics drive the filter rail, so reuse existing strings rather
 * than inventing near-duplicates ("XSS" not "Cross-Site Scripting"). Newest
 * first is enforced at render time, so order here is only a hint.
 */
export const BLOG: BlogPost[] = [
  {
    slug: 'mass-assignment-php-type-juggling-account-takeover',
    date: '2026-05-22',
    title:
      'How I Chained Mass Assignment + PHP Type Juggling to Take Over Any Account on a Live Platform',
    summary:
      'A bug bounty writeup on an unauthenticated account takeover via a password reset endpoint.',
    author: PROFILE.name,
    topics: ['Account Takeover', 'AppSec', 'Bug Bounty', 'PHP', 'YesWeHack'],
    hero: '/posts/mass-assignment-php-type-juggling-account-takeover.webp',
    readingTime: '8 min read',
    body: body('mass-assignment-php-type-juggling-account-takeover'),
  },
  {
    slug: 'stored-xss-markdown-url-attribute-injection',
    date: '2026-05-20',
    title: 'Stored XSS via Markdown URL Attribute Injection — How I Earned a €450 Bug Bounty',
    summary:
      'A deep dive into unsafe string interpolation, backwards sanitization order, and why CSP is not a fix.',
    author: PROFILE.name,
    topics: ['AppSec', 'Bug Bounty', 'XSS'],
    hero: '/posts/stored-xss-markdown-url-attribute-injection.webp',
    readingTime: '6 min read',
    body: body('stored-xss-markdown-url-attribute-injection'),
  },
];

/** Looks up a post by its slug, for the `#/<slug>` route. */
export function findPost(slug: string): BlogPost | undefined {
  return BLOG.find((p) => p.slug === slug);
}
