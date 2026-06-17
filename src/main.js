import './styles/main.css';

import { REDUCED } from './modules/env.js';
import { initSmoothScroll } from './modules/smoothScroll.js';
import { initNav } from './modules/nav.js';
import { initCursor } from './modules/cursor.js';
import { initMagnetic } from './modules/magnetic.js';
import { initAliasScramble } from './modules/scramble.js';
import { initClock } from './modules/clock.js';
import { initAccordion } from './modules/accordion.js';
import { initConsole } from './modules/consoleChat.js';
import { runPreloader } from './modules/preloader.js';
import { buildHeroIntro, initRotator } from './modules/heroIntro.js';
import { initReveals } from './modules/reveals.js';
import { initBlog } from './modules/blog.js';
import { initMarqueeFx } from './modules/marqueeFx.js';
import { initSkewFx } from './modules/skewFx.js';
import { initGlitch } from './modules/glitch.js';
import { initCinematicExperience } from './modules/cinematic.js';

/* marquee: duplicate track for a seamless loop */
const track = document.getElementById('marquee-track');
track.innerHTML += track.innerHTML;

const lenis = initSmoothScroll();
initNav(lenis);
initCursor();
initMagnetic();
initAliasScramble();
initClock();
initAccordion();
initConsole(lenis);
initReveals();
initRotator();
initBlog();
initMarqueeFx();
initSkewFx();
initGlitch();
initCinematicExperience();

const heroIntro = buildHeroIntro();
runPreloader(lenis, (skipped) => {
  heroIntro.play(skipped ? heroIntro.duration?.() ?? 0 : 0.55);
});

/* three.js hero — async chunk, skipped under reduced motion */
if (!REDUCED) {
  import('./three/heroParticles.js')
    .then((m) => m.initHeroParticles())
    .catch((err) => console.warn('hero canvas disabled:', err));
}
