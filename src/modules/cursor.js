import { COARSE, REDUCED } from './env.js';

export function initCursor() {
  const cursor = document.querySelector('.cursor');
  if (COARSE || REDUCED) {
    cursor.style.display = 'none';
    return;
  }
  let mx = innerWidth / 2, my = innerHeight / 2, x = mx, y = my;
  addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  (function loop() {
    x += (mx - x) * 0.2;
    y += (my - y) * 0.2;
    cursor.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseover', (e) => {
    cursor.classList.toggle('is-hover', !!e.target.closest('a, button, .hof-row, .chip'));
  }, { passive: true });
}
