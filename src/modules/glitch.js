import { REDUCED } from './env.js';
import { scramble } from './scramble.js';

/*
  Monochrome "decrypt" glitch for display headings + decrypt-on-hover nav.
  On-brand for a red-team portfolio: the type momentarily scrambles through
  cipher glyphs and resolves, as if being cracked, paired with a faint
  positional jitter. No colour shift. Markup-safe — it mutates only text
  nodes, so the SHAJAHAN caret block and the BREACH gradient stay intact.
  Hover always fires; the hero name also fires on a slow random cadence.
*/
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&<>/\\';
const KEEP = " '.-"; // punctuation/whitespace left untouched while scrambling

function textNodesIn(el) {
  const out = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) if (n.nodeValue.trim()) out.push(n);
  return out;
}

function makeScrambler(node) {
  const original = node.nodeValue;
  return (dur) => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const cut = Math.floor(p * original.length);
      let out = '';
      for (let i = 0; i < original.length; i++) {
        const c = original[i];
        out += KEEP.includes(c) || i < cut ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      node.nodeValue = out;
      if (p < 1) requestAnimationFrame(step);
      else node.nodeValue = original;
    };
    requestAnimationFrame(step);
  };
}

export function initGlitch() {
  if (REDUCED) return;

  document.querySelectorAll('[data-glitch]').forEach((el) => {
    const scramblers = textNodesIn(el).map(makeScrambler);
    if (!scramblers.length) return;

    const fire = (dur = 520) => {
      el.classList.remove('is-glitch');
      void el.offsetWidth; // restart the jitter animation
      el.classList.add('is-glitch');
      clearTimeout(el._glitchTimer);
      el._glitchTimer = setTimeout(() => el.classList.remove('is-glitch'), dur);
      scramblers.forEach((s) => s(dur));
    };

    el._fireGlitch = fire;
    el.addEventListener('mouseenter', () => fire(), { passive: true });
  });

  /* ambient cadence on the hero name only, paused when off-screen / hidden */
  const hero = document.getElementById('hero-name');
  if (hero?._fireGlitch) {
    const tick = () => {
      const wait = 5200 + Math.random() * 5200;
      setTimeout(() => {
        if (!document.hidden && hero.getBoundingClientRect().bottom > 0) hero._fireGlitch();
        tick();
      }, wait);
    };
    tick();
  }

  /* nav links decrypt on hover via the existing scramble engine */
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const original = a.textContent;
    a.addEventListener('mouseenter', () => scramble(a, original, 420), { passive: true });
  });
}
