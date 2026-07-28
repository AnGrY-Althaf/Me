export const PROFILE = {
  name: 'Althaf Shajahan',
  alias: 'AnGrY',
  tagline: 'My notes on offensive security, bug bounty, and AI.',
  photo: '/mypic-anime.png',
  email: 'angry.althaf@gmail.com',
  linkedin: 'https://www.linkedin.com/in/althaf-shajahan-angry/',
  github: 'https://github.com/AnGrY-Althaf',
};

export interface NavItem {
  id: string;
  label: string;
}

export const NAV: NavItem[] = [
  { id: 'whoami', label: 'whoami' },
  { id: 'experience', label: 'experience' },
  { id: 'arsenal', label: 'arsenal' },
  { id: 'writing', label: 'writing' },
];

/* ------------------------------------------------------------ whoami */

export const INTRO = [
  'I break things to make them stronger. I work as a security researcher specialising in offensive security — bug bounty hunting, red team operations, CTF, and AI.',
  'Six years in, I have hunted on HackerOne, YesWeHack and Bugcrowd, run adversary simulation engagements, and taught the next wave of operators. Lately I have been pointing the same lens at AI systems: agent tooling, MCP servers, and the attack surface nobody has finished mapping yet.',
  'Reach out if you want a target looked at properly, need a red team engagement, or want help securing an AI product before it ships.',
];

export const CREED = 'Hack. Code. Secure.';

/** The "whereami" block — label/value contact rows. */
export const CONTACT = [
  { label: 'email', value: 'angry.althaf@gmail.com', href: 'mailto:angry.althaf@gmail.com' },
  {
    label: 'linkedin',
    value: 'Althaf Shajahan',
    href: 'https://www.linkedin.com/in/althaf-shajahan-angry/',
  },
  { label: 'github', value: 'AnGrY-Althaf', href: 'https://github.com/AnGrY-Althaf' },
  { label: 'hackerone', value: 'bug bounty hunter', href: '' },
  { label: 'yeswehack', value: 'bug bounty hunter', href: '' },
  { label: 'bugcrowd', value: 'bug bounty hunter', href: '' },
];

export const QUICK_FACTS = [
  { label: 'experience', value: '6+ years offensive security' },
  { label: 'focus', value: 'web, api, android, cloud, AI / MCP' },
  { label: 'platforms', value: 'HackerOne · YesWeHack · Bugcrowd' },
  { label: 'based', value: 'India' },
];

/* -------------------------------------------------------- experience */

export const EXPERIENCE = [
  {
    role: 'Senior Security Researcher',
    org: 'Offenso Hacker Academy',
    period: '2025 — present',
    notes: [
      'Leading offensive security research and internal tooling.',
      'Training and mentoring the next wave of operators.',
    ],
  },
  {
    role: 'Security Researcher',
    org: 'RedTeam Hacker Academy',
    period: '2023 — 2024',
    notes: [
      'Adversary simulation and exploit development.',
      'Built and delivered hands-on offensive security curriculum.',
    ],
  },
  {
    role: 'Bug Bounty Hunter',
    org: 'HackerOne · YesWeHack · Bugcrowd',
    period: '2021 — present',
    notes: [
      'Web, API and Android targets on live programmes.',
      'Reporting reproducible impact — no theoretical findings.',
    ],
  },
];

export const CREDENTIALS = [
  { code: 'CRTA', name: 'Certified Red Team Analyst' },
  { code: 'CEH', name: 'Certified Ethical Hacker' },
  { code: 'CAP', name: 'Certified AppSec Practitioner' },
  { code: 'CNSP', name: 'Certified Network Security Practitioner' },
  { code: 'HTB Pro Labs', name: 'Dante · RastaLabs · POO' },
];

export const HALL_OF_FAME = [
  { org: 'NASA', note: 'acknowledged' },
  { org: 'Dell', note: 'acknowledged' },
  { org: 'Mastercard', note: 'acknowledged' },
  { org: 'Sony', note: 'acknowledged' },
  { org: 'HackTheBox', note: 'Pro Hacker' },
  { org: 'TryHackMe', note: 'Top 1%' },
];

/* ----------------------------------------------------------- arsenal */

export const SKILLS = [
  {
    group: 'offensive',
    items: [
      'Bug bounty hunting',
      'Penetration testing',
      'Red teaming',
      'CTF',
      'Malware analysis',
    ],
  },
  {
    group: 'surfaces',
    items: ['Web', 'API', 'Android', 'Cloud', 'AI / MCP'],
  },
  {
    group: 'code',
    items: ['Python', 'Bash', 'Go', 'Java', 'JavaScript', 'C', 'C++'],
  },
];

export const SERVICES = [
  {
    title: 'Penetration testing',
    note: 'Web, API, mobile and network engagements with reproducible proof.',
  },
  {
    title: 'Red teaming',
    note: 'Adversarial simulation against people, process and perimeter.',
  },
  {
    title: 'AI integrations',
    note: 'MCP servers, agent tooling, and LLM attack-surface review.',
  },
  {
    title: 'Security automation',
    note: 'Recon pipelines and custom scanners that scale with the target.',
  },
  {
    title: 'Security consultation',
    note: 'Threat modelling and architecture review before code ships.',
  },
  {
    title: 'Training',
    note: 'Hands-on offensive security programmes and lab design.',
  },
];

/* ----------------------------------------------------------- writing */

/**
 * PLACEHOLDER POSTS — replace with your real ones.
 *
 * Set `href` to publish a link; entries with an empty `href` render as plain
 * text rather than a dead link, so an unfinished list never looks broken.
 */
export const POSTS = [
  {
    date: '2026',
    title: 'Hunting IDOR at scale',
    tag: 'bug bounty',
    blurb: 'Placeholder — swap this for a real post.',
    href: '',
  },
  {
    date: '2025',
    title: 'MCP servers as attack surface',
    tag: 'ai security',
    blurb: 'Placeholder — swap this for a real post.',
    href: '',
  },
  {
    date: '2025',
    title: 'Recon automation that scales',
    tag: 'tooling',
    blurb: 'Placeholder — swap this for a real post.',
    href: '',
  },
  {
    date: '2024',
    title: 'Notes from HTB Pro Labs',
    tag: 'red team',
    blurb: 'Placeholder — swap this for a real post.',
    href: '',
  },
];
