import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsapSetup.js';
import { REDUCED } from './env.js';

export function initSmoothScroll() {
  let lenis = null;
  if (!REDUCED) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const scrollToEl = (target) => {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -70, duration: 1.4 });
    else el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth' });
  };

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        scrollToEl(id);
      }
    });
  });

  document.querySelector('[data-scroll-top]')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (lenis) lenis.scrollTo(0);
    else scrollTo({ top: 0, behavior: 'smooth' });
  });

  return lenis;
}
