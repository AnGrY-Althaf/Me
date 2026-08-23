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
  /** ISO date — sorted on, and formatted for display as YYYY.M.D. */
  date: string;
  title: string;
  summary: string;
  author: string;
  topics: string[];
  href: string;
}

/**
 * The feed. Topics drive the sidebar filter, so reuse existing strings
 * rather than inventing near-duplicates ("XSS" not "Cross-Site Scripting").
 * Newest first is enforced at render time, so order here is only a hint.
 */
export const BLOG: BlogPost[] = [
  {
    date: '2026-05-22',
    title:
      'How I Chained Mass Assignment + PHP Type Juggling to Take Over Any Account on a Live Platform',
    summary:
      'A mass assignment flaw and a loose PHP comparison, chained together into full account takeover on a live YesWeHack target.',
    author: PROFILE.name,
    topics: ['Account Takeover', 'AppSec', 'Bug Bounty', 'PHP', 'YesWeHack'],
    href: 'https://medium.com/@angry.althaf/how-i-chained-mass-assignment-php-type-juggling-to-take-over-any-account-on-a-live-platform-8ad4b193e171',
  },
  {
    date: '2026-05-20',
    title: 'Stored XSS via Markdown URL Attribute Injection — How I Earned a €450 Bug Bounty',
    summary:
      'Markdown link rendering let attributes escape the URL slot, turning an ordinary input into stored XSS. Paid out at €450.',
    author: PROFILE.name,
    topics: ['AppSec', 'Bug Bounty', 'XSS'],
    href: 'https://medium.com/@angry.althaf/stored-xss-via-markdown-url-attribute-injection-how-i-earned-a-450-bug-bounty-48c40ae644ef',
  },
];
