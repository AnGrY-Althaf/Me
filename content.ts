export interface SectionMeta {
  id: string;
  label: string;
}

/** Order here drives the nav, the panel sequence and the camera stations. */
export const SECTIONS: SectionMeta[] = [
  { id: 'intro', label: 'intro' },
  { id: 'about', label: 'about' },
  { id: 'experience', label: 'experience' },
  { id: 'arsenal', label: 'arsenal' },
  { id: 'credentials', label: 'credentials' },
  { id: 'hall', label: 'hall of fame' },
  { id: 'services', label: 'services' },
  { id: 'contact', label: 'contact' },
];

export const PROFILE = {
  name: 'Althaf Shajahan',
  alias: 'AnGrY',
  role: 'Security Researcher',
  status: 'portfolio — 2k26',
  tagline: 'Hack. Code. Secure.',
  blurb:
    'I break things to make them stronger. Offensive security, bug bounty hunting, red team operations, CTF and AI.',
  email: 'angry.althaf@gmail.com',
  linkedin: 'https://www.linkedin.com/in/althaf-shajahan-angry/',
  github: 'https://github.com/AnGrY-Althaf',
};

export const METRICS = [
  { n: '6+', k: 'years offensive' },
  { n: '3', k: 'bounty platforms' },
  { n: '5', k: 'certifications' },
  { n: '1%', k: 'tryhackme top' },
];

export const EXPERIENCE = [
  {
    when: '2025 — now',
    role: 'Senior Security Researcher',
    org: 'Offenso Hacker Academy',
    note: 'Leading offensive research, building tooling and training the next wave of operators.',
  },
  {
    when: '2023 — 2024',
    role: 'Security Researcher',
    org: 'RedTeam Hacker Academy',
    note: 'Adversary simulation, exploit development and hands-on security curriculum.',
  },
  {
    when: '2021 — now',
    role: 'Bug Bounty Hunter',
    org: 'HackerOne · YesWeHack · Bugcrowd',
    note: 'Web, API and Android targets. Reporting real impact, not theory.',
  },
];

export const ARSENAL = [
  {
    group: 'Offensive',
    items: [
      'Bug Bounty Hunting',
      'Penetration Testing',
      'Red Teaming',
      'CTF',
      'Malware Analysis',
    ],
  },
  {
    group: 'Surfaces',
    items: ['Web', 'API', 'Android', 'Cloud', 'AI / MCP'],
  },
  {
    group: 'Code',
    items: ['Python', 'Bash', 'Go', 'Java', 'JavaScript', 'C / C++'],
  },
];

export const CREDENTIALS = [
  { name: 'CRTA', full: 'Certified Red Team Analyst' },
  { name: 'CEH', full: 'Certified Ethical Hacker' },
  { name: 'CAP', full: 'Certified AppSec Practitioner' },
  { name: 'CNSP', full: 'Certified Network Security Practitioner' },
  { name: 'HTB Pro Labs', full: 'Dante · RastaLabs · POO' },
];

export const HALL = [
  { name: 'NASA', meta: 'acknowledged' },
  { name: 'Mastercard', meta: 'acknowledged' },
  { name: 'Sony', meta: 'acknowledged' },
  { name: 'Dell', meta: 'acknowledged' },
  { name: 'HackTheBox', meta: 'pro hacker' },
  { name: 'TryHackMe', meta: 'top 1%' },
];

export const SERVICES = [
  { title: 'Penetration Testing', note: 'Web, API, mobile and network engagements with reproducible proof.' },
  { title: 'Red Teaming', note: 'Adversarial simulation against people, process and perimeter.' },
  { title: 'AI Integrations', note: 'MCP servers, agent tooling and LLM attack-surface review.' },
  { title: 'Security Automation', note: 'Recon pipelines and custom scanners that scale with the target.' },
  { title: 'Consultation', note: 'Threat modelling and architecture review before code ships.' },
  { title: 'Training', note: 'Hands-on offensive security programmes and lab design.' },
];
