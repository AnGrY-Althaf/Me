import { gsap, ScrollTrigger } from './gsapSetup.js';
import { COARSE, REDUCED } from './env.js';

function injectAmbientLayer() {
  if (document.querySelector('.ambient-grid')) return;

  const ambient = document.createElement('div');
  ambient.className = 'ambient-grid';
  ambient.setAttribute('aria-hidden', 'true');

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  progress.innerHTML = '<i></i>';

  document.body.prepend(ambient);
  document.body.appendChild(progress);
}

function initPointerVars() {
  if (COARSE) return;

  const root = document.documentElement;
  const setX = gsap.quickTo(root, '--mx', { duration: 0.55, ease: 'power3' });
  const setY = gsap.quickTo(root, '--my', { duration: 0.55, ease: 'power3' });
  const tiltX = gsap.quickTo(root, '--tilt-x', { duration: 0.8, ease: 'power3' });
  const tiltY = gsap.quickTo(root, '--tilt-y', { duration: 0.8, ease: 'power3' });

  addEventListener('mousemove', (e) => {
    const px = e.clientX / innerWidth;
    const py = e.clientY / innerHeight;
    setX(`${(px * 100).toFixed(2)}%`);
    setY(`${(py * 100).toFixed(2)}%`);
    tiltX(((py - 0.5) * -8).toFixed(3));
    tiltY(((px - 0.5) * 10).toFixed(3));
  }, { passive: true });
}

function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress i');
  if (!bar) return;

  gsap.set(bar, { scaleX: 0, transformOrigin: '0 50%' });
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => gsap.to(bar, {
      scaleX: self.progress,
      duration: 0.18,
      ease: 'none',
      overwrite: true,
    }),
  });
}

function initHeroDirection() {
  if (REDUCED) return;

  gsap.to('.hero-vignette', {
    opacity: 0.72,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 35%', scrub: true },
  });

  gsap.fromTo('.hero-foot .hf, .hero-scroll', { y: 20, opacity: 0 }, {
    y: 0,
    opacity: 1,
    duration: 0.85,
    ease: 'power3.out',
    stagger: 0.08,
    delay: 1.2,
  });

  gsap.to('.marquee', {
    '--marquee-scan': '100%',
    ease: 'none',
    scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true },
  });
}

function initSectionStages() {
  if (REDUCED) return;

  gsap.utils.toArray('.section').forEach((section) => {
    gsap.fromTo(section, { '--stage': 0 }, {
      '--stage': 1,
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top 85%', end: 'bottom 15%', scrub: true },
    });
  });

  gsap.utils.toArray('.stats .stat').forEach((stat, i) => {
    gsap.fromTo(stat, {
      y: 54,
      opacity: 0,
      rotateX: -24,
      transformPerspective: 800,
    }, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.95,
      ease: 'power3.out',
      delay: i * 0.045,
      scrollTrigger: { trigger: stat, start: 'top 92%', once: true },
    });
  });

  gsap.utils.toArray('.exp-row').forEach((row, i) => {
    gsap.fromTo(row, {
      x: i % 2 ? 70 : -70,
      opacity: 0,
      clipPath: 'inset(0 18% 0 18%)',
    }, {
      x: 0,
      opacity: 1,
      clipPath: 'inset(0 0% 0 0%)',
      duration: 1,
      ease: 'power4.out',
      scrollTrigger: { trigger: row, start: 'top 86%', once: true },
    });
  });

  gsap.fromTo('.hof-row', {
    yPercent: 65,
    opacity: 0,
    rotateX: -18,
    transformPerspective: 900,
  }, {
    yPercent: 0,
    opacity: 1,
    rotateX: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.075,
    scrollTrigger: { trigger: '.hof-list', start: 'top 82%', once: true },
  });

  gsap.fromTo('.svc-item', { xPercent: -6, opacity: 0 }, {
    xPercent: 0,
    opacity: 1,
    duration: 0.78,
    ease: 'power3.out',
    stagger: 0.065,
    scrollTrigger: { trigger: '.svc-list', start: 'top 86%', once: true },
  });
}

function initHoverKinetics() {
  if (COARSE || REDUCED) return;

  const interactiveRows = gsap.utils.toArray('.blog-row, .exp-row, .hof-row, .svc-head, .contact-link');
  interactiveRows.forEach((row) => {
    const qx = gsap.quickTo(row, 'x', { duration: 0.45, ease: 'power3' });
    const qy = gsap.quickTo(row, 'y', { duration: 0.45, ease: 'power3' });

    row.addEventListener('mousemove', (e) => {
      const r = row.getBoundingClientRect();
      qx((e.clientX - (r.left + r.width / 2)) * 0.018);
      qy((e.clientY - (r.top + r.height / 2)) * 0.035);
    }, { passive: true });

    row.addEventListener('mouseleave', () => {
      qx(0);
      qy(0);
    });
  });

  gsap.utils.toArray('.stat, .about-portrait').forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.55, ease: 'power3' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.55, ease: 'power3' });
    const z = gsap.quickTo(card, 'z', { duration: 0.55, ease: 'power3' });

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      rx(((e.clientY - r.top) / r.height - 0.5) * -6);
      ry(((e.clientX - r.left) / r.width - 0.5) * 7);
      z(18);
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      rx(0);
      ry(0);
      z(0);
    });
  });
}

export function initCinematicExperience() {
  injectAmbientLayer();
  initPointerVars();
  initScrollProgress();
  initHeroDirection();
  initSectionStages();
  initHoverKinetics();
}
