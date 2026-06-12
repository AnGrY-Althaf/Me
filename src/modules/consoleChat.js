export function initConsole(lenis) {
  const overlay = document.getElementById('term-overlay');
  const body = document.getElementById('term-body');
  const input = document.getElementById('term-input');
  let booted = false;
  let lastFocus = null;

  function print(role, text) {
    const div = document.createElement('div');
    div.className = 'term-msg ' + role;
    const lbl = document.createElement('span');
    lbl.className = 'lbl';
    lbl.textContent = role === 'user' ? '// USER INPUT' : '// SYSTEM';
    div.appendChild(lbl);
    div.appendChild(document.createTextNode(text));
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function respond(msg) {
    const q = msg.toLowerCase();
    if (q.includes('help')) return 'Commands:\n  whoami · creds · experience · skills\n  achievements · services · contact · clear';
    if (q.includes('whoami') || q.includes('who')) return '[IDENTITY]\nName: Althaf Shajahan (aka AnGrY)\nRole: Security Engineer / Security Researcher / Bug Bounty Hunter\nExp: 6+ Years\nSpecialized in Product Security, VAPT, Security Architecture, Offensive Security, Bug Bounty, Red Team, AI.';
    if (q.includes('cred') || q.includes('cert')) return '[CREDENTIALS]\n• CRTA — Certified Red Team Analyst\n• CEH  — Certified Ethical Hacker\n• CAP  — Certified AppSec Practitioner\n• CNSP — Certified Network Security Practitioner\n• HTB ProLabs: Dante · RastaLabs · Poo';
    if (q.includes('exp') || q.includes('work')) return '[EXPERIENCE]\n1. Security Engineer @ Veuz Concepts                 [2026–Present]\n2. Sr. Security Researcher @ Offenso Hacker Academy  [2025–2026]\n3. Security Researcher @ RedTeam Hacker Academy      [2023–2024]\n4. Bug Bounty Hunter @ HackerOne / YesWeHack / BC    [2021–Present]';
    if (q.includes('skill')) return '[CAPABILITIES]\n• Bug Bounty Hunting\n• CTF / Pen Testing\n• AI / MCP Integration\n• Web / API / Android Security\n• Malware Analysis\n• Python · Bash · JS · Go · C / C++';
    if (q.includes('achieve') || q.includes('fame') || q.includes('hall')) return '[HALL OF FAME]\n• NASA\n• MasterCard\n• Sony\n• Dela\n• HackTheBox — Pro Hacker\n• TryHackMe  — Top 1%';
    if (q.includes('service') || q.includes('offer')) return '[SERVICES]\n• Penetration Testing\n• AI Integrations (MCP)\n• Security Consultation\n• Security Automation\n• Cyber Security Training\n• Red Teaming (Adversarial Simulation)';
    if (q.includes('contact') || q.includes('reach') || q.includes('mail')) return '[CONTACT]\nMail: angry.althaf@gmail.com\nLinkedIn: /in/althaf-shajahan-angry/\nGitHub: /AnGrY-Althaf';
    return 'command not found. type `help` for available commands.';
  }

  function send() {
    const val = input.value.trim();
    if (!val) return;
    input.value = '';
    if (val.toLowerCase() === 'clear') {
      body.innerHTML = '';
      print('sys', 'session cleared.');
      return;
    }
    print('user', val);
    setTimeout(() => print('sys', respond(val)), 300 + Math.random() * 250);
  }

  function open() {
    lastFocus = document.activeElement;
    overlay.classList.add('open');
    if (lenis) lenis.stop();
    document.body.style.overflow = 'hidden';
    if (!booted) {
      booted = true;
      print('sys', 'angry@console:~# initializing session...\nAccess granted. Welcome to the AnGrY secure channel.\nType `help` for available commands.');
    }
    setTimeout(() => input.focus(), 150);
  }

  function close() {
    overlay.classList.remove('open');
    if (lenis) lenis.start();
    document.body.style.overflow = '';
    lastFocus?.focus();
  }

  document.querySelectorAll('[data-open-console]').forEach((b) => b.addEventListener('click', open));
  document.getElementById('term-close').addEventListener('click', close);
  document.getElementById('term-dot-close').addEventListener('click', close);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      overlay.classList.contains('open') ? close() : open();
    }
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });
}
