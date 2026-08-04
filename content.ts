export const PROFILE = {
  name: 'Althaf Shajahan',
  alias: 'AnGrY',
  role: 'Security Engineer',
  tagline: 'My notes on offensive security, bug bounty, and AI.',
  photo: '/mypic-anime.png',
  email: 'angry.althaf@gmail.com',
  linkedin: 'https://www.linkedin.com/in/althaf-shajahan-angry/',
  github: 'https://github.com/AnGrY-Althaf',
  medium: 'https://medium.com/@angry.althaf',
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
  'I break things to make them stronger. I am a Security Engineer at Veuz Concepts, working on product security, VAPT, and security architecture design.',
  'Alongside that I hunt bug bounties on HackerOne, YesWeHack and Bugcrowd, with four assigned CVEs and Hall of Fame entries at NASA, Mastercard, Sony and Dela. Before Veuz I led offensive research at Offenso Hacker Academy and ran red team operations at RedTeam Hacker Academy, where I built custom exploit frameworks and trained the next generation of security professionals.',
  'Available for bug bounty collaboration, red team engagements, consulting and training.',
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
  { label: 'medium', value: '@angry.althaf', href: 'https://medium.com/@angry.althaf' },
  { label: 'platforms', value: 'HackerOne · YesWeHack · Bugcrowd', href: '' },
  { label: 'pgp', value: 'available on request', href: '' },
];

export const QUICK_FACTS = [
  { label: 'currently', value: 'Security Engineer at Veuz Concepts' },
  { label: 'focus', value: 'product security, VAPT, security architecture' },
  { label: 'hunting', value: 'HackerOne · YesWeHack · Bugcrowd' },
  { label: 'cves', value: '4 assigned' },
  { label: 'hall of fame', value: 'NASA · Mastercard · Sony · Dela' },
];

/* -------------------------------------------------------- experience */

export const EXPERIENCE = [
  {
    role: 'Security Engineer',
    org: 'Veuz Concepts',
    period: '2026 — present',
    notes: [
      'Product security, vulnerability assessment and penetration testing (VAPT).',
      'Security architecture design and implementation.',
    ],
  },
  {
    role: 'Senior Security Researcher',
    org: 'Offenso Hacker Academy',
    period: '2025 — 2026',
    notes: [
      'Led offensive security research and vulnerability assessment.',
      'Ran adversarial simulation engagements.',
    ],
  },
  {
    role: 'Security Researcher',
    org: 'RedTeam Hacker Academy',
    period: '2023 — 2024',
    notes: [
      'Conducted red team operations and developed custom exploit frameworks.',
      'Trained the next generation of security professionals.',
    ],
  },
  {
    role: 'Bug Bounty Hunter',
    org: 'HackerOne · YesWeHack · Bugcrowd',
    period: '2021 — present',
    notes: [
      'Independent security research across global platforms.',
      'Hall of Fame entries at NASA, Mastercard, Sony and Dela.',
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

/** Assigned CVE identifiers. */
export const CVES = [
  'CVE-2026-37724',
  'CVE-2026-54074',
  'CVE-2026-50742',
  'CVE-2026-50743',
];

export const HALL_OF_FAME = [
  { org: 'NASA', rank: 'Hall of Fame', note: 'Responsible disclosure — critical infrastructure' },
  { org: 'Mastercard', rank: 'Hall of Fame', note: 'Financial platform security research' },
  { org: 'Sony', rank: 'Hall of Fame', note: 'Consumer platform vulnerability chain' },
  { org: 'Dela', rank: 'Hall of Fame', note: 'Enterprise application security finding' },
  { org: 'HackTheBox', rank: 'Pro Hacker', note: 'Elite tier — consistent top ranking' },
  { org: 'TryHackMe', rank: 'Top 1%', note: 'Global ranking across all challenges' },
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
  { title: 'Penetration Testing', scope: 'Web · API · Mobile · Network', note: 'Full-scope adversarial assessment.' },
  {
    title: 'Red Team Operations',
    scope: 'Adversarial simulation · Social engineering',
    note: 'Persistence and lateral movement.',
  },
  {
    title: 'AI / MCP Integration',
    scope: 'Security-aware AI deployments',
    note: 'MCP attack surface assessment.',
  },
  {
    title: 'Security Automation',
    scope: 'Custom tooling · Python / Bash',
    note: 'CI/CD security pipelines.',
  },
  {
    title: 'Security Consultation',
    scope: 'Architecture review · Threat modelling',
    note: 'Compliance advisory.',
  },
  {
    title: 'Training & Education',
    scope: 'CTF workshops · Bootcamps',
    note: 'Corporate security awareness.',
  },
];

/* ----------------------------------------------------------- writing */

/**
 * Add new posts to the top. An entry with an empty `href` renders as plain
 * text rather than a dead link, so a draft can sit here safely.
 */
export const POSTS = [
  {
    date: '22 May 2026',
    title:
      'How I Chained Mass Assignment + PHP Type Juggling to Take Over Any Account on a Live Platform',
    tag: 'bug bounty · appsec · yeswehack',
    blurb: '',
    href: 'https://medium.com/@angry.althaf/how-i-chained-mass-assignment-php-type-juggling-to-take-over-any-account-on-a-live-platform-8ad4b193e171',
  },
  {
    date: '20 May 2026',
    title: 'Stored XSS via Markdown URL Attribute Injection — How I Earned a €450 Bug Bounty',
    tag: 'xss · appsec · bug bounty',
    blurb: '',
    href: 'https://medium.com/@angry.althaf/stored-xss-via-markdown-url-attribute-injection-how-i-earned-a-450-bug-bounty-48c40ae644ef',
  },
];
