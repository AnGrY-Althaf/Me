import { gsap, ScrollTrigger, SplitText } from './gsapSetup.js';
import { REDUCED } from './env.js';
import { scramble } from './scramble.js';

/* ── odometer: rolling digit columns ── */
function buildOdometer(el) {
  const final = String(el.dataset.count);
  el.textContent = '';
  el.classList.add('odo');
  const digits = [];
  for (const ch of final) {
    if (!/\d/.test(ch)) {
      const s = document.createElement('span');
      s.className = 'odo-static';
      s.textContent = ch;
      el.appendChild(s);
      continue;
    }
    const d = document.createElement('span');
    d.className = 'odo-digit';
    const tr = document.createElement('span');
    tr.className = 'odo-track';
    for (let rep = 0; rep < 3; rep++) {
      for (let n = 0; n <= 9; n++) {
        const c = document.createElement('span');
        c.className = 'odo-cell';
        c.textContent = n;
        tr.appendChild(c);
      }
    }
    d.appendChild(tr);
    el.appendChild(d);
    digits.push({ tr, target: +ch });
  }
  return digits;
}

export function initReveals() {
  if (REDUCED) {
    document.querySelectorAll('[data-reveal], [data-reveal-group] > *').forEach((el) => {
      el.style.opacity = 1;
    });
    document.querySelectorAll('[data-count]').forEach((el) => {
      el.textContent = el.dataset.count;
    });
    document.querySelectorAll('[data-cap-bar]').forEach((el) => {
      el.style.width = el.dataset.level + '%';
    });
    return;
  }

  /* section titles: per-char 3D scatter assembly */
  document.querySelectorAll('.sec-title').forEach((el) => {
    try {
      gsap.set(el, { perspective: 600 });
      const split = new SplitText(el, { type: 'chars' });
      gsap.from(split.chars, {
        yPercent: 120,
        rotateX: -80,
        opacity: 0,
        transformOrigin: '50% 100% -16px',
        duration: 1.0,
        ease: 'back.out(1.4)',
        stagger: { each: 0.028, from: 'random' },
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    } catch {
      /* SplitText failure — element stays visible */
    }
  });

  /* section path labels: decrypt on enter */
  document.querySelectorAll('.sec-path b').forEach((el) => {
    const finalText = el.textContent;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => scramble(el, finalText, 700),
    });
  });

  /* generic reveals */
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.fromTo(el, { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 87%', once: true },
    });
  });
  gsap.utils.toArray('[data-reveal-group]').forEach((group) => {
    gsap.fromTo(group.children, { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.09,
      scrollTrigger: { trigger: group, start: 'top 88%', once: true },
    });
  });

  /* stats: odometer roll */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const digits = buildOdometer(el);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        digits.forEach((d, i) => {
          gsap.fromTo(d.tr, { y: 0 }, {
            y: -(20 + d.target) + 'em',
            duration: 1.7 + i * 0.18,
            ease: 'power4.inOut',
            delay: i * 0.08,
          });
        });
      },
    });
  });

  /* capability bars */
  document.querySelectorAll('[data-cap-bar]').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () =>
        gsap.to(el, {
          width: el.dataset.level + '%',
          duration: 1.4,
          ease: 'power4.out',
          delay: (i % 4) * 0.08,
        }),
    });
  });

  /* about portrait drift */
  const portrait = document.querySelector('.about-portrait');
  if (portrait) {
    gsap.fromTo(portrait, { y: 30 }, {
      y: -30,
      ease: 'none',
      scrollTrigger: { trigger: portrait, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    });
  }

  /* about lede: word-by-word scrub */
  const lede = document.getElementById('about-lede');
  if (lede) {
    const words = [];
    [...lede.childNodes].forEach((node) => {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach((part) => {
          if (/^\s*$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const s = document.createElement('span');
          s.className = 'w';
          s.textContent = part;
          frag.appendChild(s);
          words.push(s);
        });
        lede.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        node.classList.add('w');
        words.push(node);
      }
    });
    gsap.to(words, {
      opacity: 1,
      stagger: 0.05,
      ease: 'none',
      scrollTrigger: { trigger: lede, start: 'top 82%', end: 'top 35%', scrub: true },
    });
  }

  /* contact mega rows */
  gsap.from('.contact-mega .row > span', {
    yPercent: 110,
    duration: 1.1,
    ease: 'power4.out',
    stagger: 0.1,
    scrollTrigger: { trigger: '.contact-mega', start: 'top 85%', once: true },
  });
}
