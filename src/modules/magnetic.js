import { gsap } from './gsapSetup.js';
import { COARSE, REDUCED } from './env.js';

/*
  Spring-physics magnetics. The element eases toward the pointer with a
  smoothed quickTo tween (no per-frame jitter), and any inner icon drifts a
  little further for parallax depth — the "intent" feel ported from
  motion-framer's gesture/spring choreography into GSAP.
*/
export function initMagnetic() {
  if (COARSE || REDUCED) return;

  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const inner = el.querySelector('.arr, svg');
    const pull = Number(el.dataset.magnetic) || 0.4;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    const ixTo = inner && gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3' });
    const iyTo = inner && gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3' });

    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - r.left - r.width / 2;
      const dy = e.clientY - r.top - r.height / 2;
      xTo(dx * pull);
      yTo(dy * pull);
      if (ixTo) { ixTo(dx * pull * 0.4); iyTo(dy * pull * 0.5); }
    }, { passive: true });

    el.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
      if (ixTo) { ixTo(0); iyTo(0); }
    });
  });
}
