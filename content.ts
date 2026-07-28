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
  roles: ['Security Researcher', 'Bug Bounty Hunter', 'Red Teamer', 'CTF & AI'],
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
  { name: 'Dell', scale: 0.95 },
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
  meta: 'AnGrY · security researcher · Earth',
};

/** 05 — numbers: giant outlined numerals with captions */
export const NUMBERS = [
  { n: '+6', caption: 'years offensive', giant: true },
  { n: '+80', caption: 'bugs reported' },
  { n: '5', caption: 'certifications' },
  { n: '3', caption: 'bounty platforms' },
  { n: '1%', caption: 'tryhackme top' },
];

/** 06 — experience, presented as click-to-expand case studies */
export const CASES = [
  {
    title: 'Senior Security Researcher',
    org: 'OFFENSO',
    year: '2K25',
    period: '2025 — present',
    company: 'Offenso Hacker Academy',
    note: 'Leading offensive research, building tooling and training the next wave of operators.',
    tags: ['Red Team', 'Research', 'Training', 'Tooling'],
  },
  {
    title: 'Security Researcher',
    org: 'REDTEAM ACADEMY',
    year: '2K23',
    period: '2023 — 2024',
    company: 'RedTeam Hacker Academy',
    note: 'Adversary simulation, exploit development and hands-on offensive security curriculum.',
    tags: ['Adversary Sim', 'Exploit Dev', 'Curriculum'],
  },
  {
    title: 'Bug Bounty Hunter',
    org: 'H1 · YWH · BC',
    year: '2K21',
    period: '2021 — present',
    company: 'HackerOne · YesWeHack · Bugcrowd',
    note: 'Web, API and Android targets. Real impact, reproducible proof — no theory.',
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

/** 08 — manifesto: question deep in space, answer at the nebula */
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
