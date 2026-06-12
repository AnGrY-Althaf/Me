import { gsap } from './gsapSetup.js';
import { REDUCED } from './env.js';

/* scroll-velocity-reactive marquee: speeds up with scroll, reverses direction
   when scrolling up. Replaces the CSS keyframe animation when JS runs. */
export function initMarqueeFx() {
  if (REDUCED) return;
  const track = document.getElementById('marquee-track');
  if (!track) return;
  track.style.animation = 'none';

  let x = 0;
  let lastY = scrollY;
  let vel = 0;

  gsap.ticker.add((time, deltaMs) => {
    const dt = deltaMs / 1000;
    const y = scrollY;
    vel += (((y - lastY) / Math.max(dt, 0.001)) - vel) * 0.12;
    lastY = y;

    const dir = vel < -40 ? 1 : -1; // scrolling up reverses travel
    const speed = 70 + Math.min(Math.abs(vel) * 0.22, 420);
    x += dir * speed * dt;

    const half = track.scrollWidth / 2;
    if (half > 0) {
      x = ((x % half) + half) % half; // wrap into [0, half)
      track.style.transform = `translateX(${-x}px)`;
    }
  });
}
