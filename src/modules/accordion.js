import { gsap } from './gsapSetup.js';
import { REDUCED } from './env.js';

export function initAccordion() {
  document.querySelectorAll('.svc-item').forEach((item) => {
    const head = item.querySelector('.svc-head');
    const body = item.querySelector('.svc-body');
    head.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      head.setAttribute('aria-expanded', String(open));
      if (REDUCED) body.style.height = open ? 'auto' : '0px';
      else gsap.to(body, { height: open ? 'auto' : 0, duration: 0.55, ease: 'power3.inOut' });
    });
  });

  // first item open by default
  const first = document.querySelector('.svc-item');
  if (first) {
    first.classList.add('open');
    first.querySelector('.svc-head').setAttribute('aria-expanded', 'true');
    first.querySelector('.svc-body').style.height = 'auto';
  }
}
