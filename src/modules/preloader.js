import { gsap } from './gsapSetup.js';
import { REDUCED } from './env.js';
import { scramble } from './scramble.js';

export function runPreloader(lenis, onDone) {
  const pre = document.getElementById('preloader');
  if (REDUCED) {
    pre.style.display = 'none';
    onDone(true);
    return;
  }

  const count = document.getElementById('pre-count');
  const bar = document.getElementById('pre-bar');
  const logLines = document.querySelectorAll('#pre-log span');
  const obj = { v: 0 };

  if (lenis) lenis.stop();
  document.body.style.overflow = 'hidden';

  scramble(document.getElementById('pre-name'), 'ALTHAF SHAJAHAN', 900);
  gsap.to(logLines, { opacity: 1, duration: 0.05, stagger: 0.4, delay: 0.2 });

  gsap.to(obj, {
    v: 100,
    duration: 2.0,
    ease: 'power2.inOut',
    onUpdate() {
      const v = Math.round(obj.v);
      count.textContent = (v < 10 ? '0' : '') + v;
      bar.style.width = v + '%';
    },
    onComplete() {
      gsap.to(pre, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
        delay: 0.15,
        onComplete() {
          pre.style.display = 'none';
          document.body.style.overflow = '';
          if (lenis) lenis.start();
        },
      });
      onDone(false);
    },
  });
}
