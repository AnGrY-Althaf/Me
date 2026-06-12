const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&<>/\\';

export function scramble(el, finalText, dur) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    let out = '';
    for (let i = 0; i < finalText.length; i++) {
      out += i < Math.floor(p * finalText.length)
        ? finalText[i]
        : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = finalText;
  }
  requestAnimationFrame(step);
}

export function initAliasScramble() {
  const alias = document.getElementById('alias-angry');
  alias?.addEventListener('mouseenter', () => scramble(alias, 'AnGrY', 500));
}
