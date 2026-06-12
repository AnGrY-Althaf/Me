import { gsap, ScrollTrigger } from './gsapSetup.js';
import { REDUCED } from './env.js';

export function buildHeroIntro() {
  if (REDUCED) return { play: () => {} };

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
  tl.from('.hero-name .row > span', { yPercent: 115, duration: 1.2, ease: 'power4.out', stagger: 0.12 }, 0)
    .from('[data-hero="tag"]', { y: 24, opacity: 0, duration: 0.8 }, 0.5)
    .from('[data-hero="desc"]', { y: 28, opacity: 0, duration: 0.9 }, 0.65)
    .from('[data-hero="ctas"] > *', { y: 24, opacity: 0, duration: 0.8, stagger: 0.09, clearProps: 'transform' }, 0.8)
    .from('[data-hero="meta"] > span', { x: 24, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.9)
    .from('[data-hero="foot"]', { opacity: 0, duration: 1.0, ease: 'power2.out' }, 1.0);

  // hero recedes on scroll
  gsap.to('.hero-inner', {
    y: 110,
    opacity: 0.15,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
  });

  return tl;
}

export function initRotator() {
  const words = ['Offensive Security', 'Bug Bounty', 'Red Team', 'AI'];
  const el = document.getElementById('hero-rotate');
  if (REDUCED) return;
  let i = 0;
  gsap.delayedCall(3.4, function cycle() {
    gsap.to(el, {
      yPercent: -120,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete() {
        i = (i + 1) % words.length;
        el.textContent = words[i];
        gsap.fromTo(el, { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
      },
    });
    gsap.delayedCall(2.8, cycle);
  });
}
