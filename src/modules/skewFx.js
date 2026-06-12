import { gsap, ScrollTrigger } from './gsapSetup.js';
import { REDUCED } from './env.js';

/* subtle velocity skew on list sections while scrolling */
export function initSkewFx() {
  if (REDUCED) return;
  const els = gsap.utils.toArray('[data-skew]');
  if (!els.length) return;
  els.forEach((el) => gsap.set(el, { transformOrigin: '50% 50%', force3D: true }));

  let target = 0;
  let current = 0;

  ScrollTrigger.create({
    onUpdate(self) {
      target = gsap.utils.clamp(-3.5, 3.5, self.getVelocity() / -400);
    },
  });

  gsap.ticker.add(() => {
    target *= 0.92; // decay toward rest
    current += (target - current) * 0.12;
    if (Math.abs(current) < 0.002 && Math.abs(target) < 0.002) {
      if (current !== 0) {
        current = 0;
        els.forEach((el) => gsap.set(el, { skewY: 0 }));
      }
      return;
    }
    els.forEach((el) => gsap.set(el, { skewY: current }));
  });
}
