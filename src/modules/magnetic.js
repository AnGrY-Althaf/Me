import { COARSE, REDUCED } from './env.js';

export function initMagnetic() {
  if (COARSE || REDUCED) return;
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.25;
      const dy = (e.clientY - r.top - r.height / 2) * 0.25;
      el.style.transform = `translate(${dx}px,${dy}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}
