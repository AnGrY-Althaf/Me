import { COARSE, REDUCED } from './env.js';

/* contextual labels: first matching selector wins */
const LABELS = [
  ['.blog-row', 'READ'],
  ['.blog-more', 'MEDIUM'],
  ['.hof-row', 'INTEL'],
  ['.exp-row', 'LOG'],
  ['.svc-head', 'EXPAND'],
  ['.about-portrait', 'AnGrY'],
  ['.contact-mail', 'MAIL'],
  ['.contact-link', 'OPEN'],
  ['.btn-main', 'GO'],
];

function labelFor(target) {
  for (const [sel, txt] of LABELS) {
    if (target.closest(sel)) return txt;
  }
  return null;
}

export function initCursor() {
  const cursor = document.querySelector('.cursor');
  if (COARSE || REDUCED) {
    cursor.style.display = 'none';
    return;
  }

  const pill = document.createElement('div');
  pill.className = 'cursor-pill';
  pill.setAttribute('aria-hidden', 'true');
  document.body.appendChild(pill);

  let mx = innerWidth / 2, my = innerHeight / 2;
  let x = mx, y = my, lx = mx, ly = my;
  addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

  (function loop() {
    x += (mx - x) * 0.2;
    y += (my - y) * 0.2;
    cursor.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
    /* the label pill trails a touch softer for a sense of mass */
    lx += (mx - lx) * 0.14;
    ly += (my - ly) * 0.14;
    pill.style.transform = `translate(${lx}px,${ly}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();

  document.addEventListener('mouseover', (e) => {
    const t = e.target;
    cursor.classList.toggle('is-hover', !!t.closest('a, button, .hof-row, .chip'));

    const label = labelFor(t);
    if (label) {
      pill.textContent = label;
      pill.classList.add('show');
      cursor.classList.add('is-quiet');
    } else {
      pill.classList.remove('show');
      cursor.classList.remove('is-quiet');
    }
  }, { passive: true });
}
