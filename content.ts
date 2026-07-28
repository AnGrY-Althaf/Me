export interface SectionMeta {
  id: string;
  label: string;
}

/** Order drives the nav, the flight stations and the scene layout. */
export const SECTIONS: SectionMeta[] = [
  { id: 'intro', label: 'intro' },
  { id: 'pitch', label: 'pitch' },
  { id: 'hall', label: 'hall of fame' },
  { id: 'story', label: 'short story' },
  { id: 'numbers', label: 'numbers' },
  { id: 'experience', label: 'experience' },
  { id: 'credentials', label: 'credentials' },
  { id: 'writing', label: 'writing' },
  { id: 'manifesto', label: 'manifesto' },
  { id: 'talk', label: "let's talk" },
];

export const PROFILE = {
  name: 'Althaf Shajahan',
  alias: 'AnGrY',
  brand: 'Althaf (AnGrY) Shajahan',
  status: 'portfolio — 2k26',
  email: 'angry.althaf@gmail.com',
  linkedin: 'https://www.linkedin.com/in/althaf-shajahan-angry/',
  github: 'https://github.com/AnGrY-Althaf',
  photo: '/mypic-anime.png',
};

/** 01 — intro */
export const INTRO = {
  first: 'ALTHAF',
  last: 'SHAJAHAN',
  paren: '( ANGRY )',
  roles: ['Security Engineer', 'Bug Bounty Hunter', 'Red Teamer', 'CTF & AI'],
};

/** 02 — pitch */
export const PITCH = {
  eyebrow: 'ELEVATOR PITCH',
  lines: [
    'I break things to make them',
    'stronger. Through recon, exploits,',
    'red teams, common sense —',
    'and AI, of course.',
  ],
};

/** 03 — hall of fame: floating wordmark cloud */
export const HALL = [
  { name: 'NASA', scale: 1.35 },
  { name: 'Mastercard', scale: 1.1 },
  { name: 'Sony', scale: 1.25 },
  { name: 'Dela', scale: 0.95 },
  { name: 'HackerOne', scale: 0.8 },
  { name: 'Bugcrowd', scale: 0.7 },
  { name: 'YesWeHack', scale: 0.75 },
  { name: 'HackTheBox', scale: 0.9 },
  { name: 'TryHackMe', scale: 0.85 },
];

/** 04 — short story */
export const STORY = {
  title: 'About me',
  bullets: [
    'Breaking software since my teens',
    'Bug bounty on live targets since 2021',
    'Red team ops & adversary simulation',
    'Python / Go automation builder',
    'CTF addict — workaholic :)',
  ],
  meta: 'AnGrY · security engineer · Earth',
};

/** 05 — numbers: giant outlined numerals with captions */
export const NUMBERS = [
  { n: '+6', caption: 'years offensive', giant: true },
  { n: '4', caption: 'hall of fame' },
  { n: '5', caption: 'certifications' },
  { n: '3', caption: 'bounty platforms' },
  { n: '1%', caption: 'tryhackme top' },
];

/** 06 — experience, presented as click-to-expand case studies */
export const CASES = [
  {
    title: 'Security Engineer',
    org: 'VEUZ CONCEPTS',
    year: '2K26',
    period: '2026 — present',
    company: 'Veuz Concepts',
    note: 'Product security, vulnerability assessment and penetration testing (VAPT), and security architecture design and implementation.',
    tags: ['Product Security', 'VAPT', 'Architecture'],
  },
  {
    title: 'Senior Security Researcher',
    org: 'OFFENSO',
    year: '2K25',
    period: '2025 — 2026',
    company: 'Offenso Hacker Academy',
    note: 'Led offensive security research, vulnerability assessment, and adversarial simulation engagements.',
    tags: ['Red Team', 'Research', 'Adversary Sim'],
  },
  {
    title: 'Security Researcher',
    org: 'REDTEAM ACADEMY',
    year: '2K23',
    period: '2023 — 2024',
    company: 'RedTeam Hacker Academy',
    note: 'Conducted red team operations, developed custom exploit frameworks, and trained the next generation of security professionals.',
    tags: ['Red Team Ops', 'Exploit Dev', 'Training'],
  },
  {
    title: 'Bug Bounty Hunter',
    org: 'H1 · YWH · BC',
    year: '2K21',
    period: '2021 — present',
    company: 'HackerOne · YesWeHack · Bugcrowd',
    note: 'Active independent security researcher with Hall of Fame entries at NASA, Mastercard, Sony and Dela.',
    tags: ['Web', 'API', 'Android', 'Recon'],
  },
];

export const CASES_HEAD = { title: 'Experience', hint: 'CLICK TO EXPAND' };

/** 07 — credentials: floating cards */
export const CREDENTIALS = [
  { code: 'CRTA', title: 'Certified Red Team Analyst', meta: 'CERT · RED TEAM' },
  { code: 'CEH', title: 'Certified Ethical Hacker', meta: 'CERT · EC-COUNCIL' },
  { code: 'CAP', title: 'Certified AppSec Practitioner', meta: 'CERT · SECOPS' },
  { code: 'CNSP', title: 'Certified Network Security Practitioner', meta: 'CERT · SECOPS' },
  { code: 'HTB', title: 'Pro Labs — Dante · RastaLabs · POO', meta: 'HACKTHEBOX' },
];

/**
 * 08 — writing. Titles are shortened for the 3D layout; the full headline
 * lives on Medium. An entry with an empty `url` renders as plain text —
 * no pointer cursor, nothing to click — so a draft can sit here safely.
 */
export const BLOG_HEAD = { title: 'Writing', hint: 'CLICK TO READ' };

export const BLOG = [
  {
    date: '2K26',
    title: 'Mass Assignment + PHP Type Juggling → ATO',
    tag: 'BUG BOUNTY',
    url: 'https://medium.com/@angry.althaf/how-i-chained-mass-assignment-php-type-juggling-to-take-over-any-account-on-a-live-platform-8ad4b193e171',
  },
  {
    date: '2K26',
    title: 'Stored XSS via Markdown URL Injection',
    tag: 'APPSEC',
    url: 'https://medium.com/@angry.althaf/stored-xss-via-markdown-url-attribute-injection-how-i-earned-a-450-bug-bounty-48c40ae644ef',
  },
  {
    date: '—',
    title: 'All posts on Medium',
    tag: '@ANGRY.ALTHAF',
    url: 'https://medium.com/@angry.althaf',
  },
];

/** 09 — manifesto: question deep in space, answer at the nebula */
export const MANIFESTO = {
  question: ['Why break things at all?', "Isn't hacking destructive?"],
  answer: ['Offense is a function.', 'Every hole I find is one', 'nobody else gets to use.'],
};

/** 09 — let's talk */
export const TALK = {
  title: "LET'S TALK",
  email: 'angry.althaf@gmail.com',
  meta: 'HACK · CODE · SECURE',
  name: 'ALTHAF SHAJAHAN',
};
