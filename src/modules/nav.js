export function initNav(lenis) {
  const nav = document.getElementById('nav');
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle('is-solid', y > 40);
    nav.classList.toggle('is-hidden', y > 500 && y > lastY);
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // scrollspy
  const spy = {};
  document.querySelectorAll('.nav-links a[data-section]').forEach((a) => {
    spy[a.dataset.section] = a;
  });
  const spyObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && spy[e.target.id]) {
          Object.values(spy).forEach((l) => l.classList.remove('active'));
          spy[e.target.id].classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );
  Object.keys(spy).forEach((id) => {
    const el = document.getElementById(id);
    if (el) spyObs.observe(el);
  });

  // mobile menu
  const burger = document.getElementById('nav-burger');
  const mm = document.getElementById('mobile-menu');
  const setMenu = (open) => {
    mm.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    mm.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    if (lenis) open ? lenis.stop() : lenis.start();
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!mm.classList.contains('open')));
  mm.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mm.classList.contains('open')) setMenu(false);
  });

  // platform-aware shortcut hint
  const kbd = document.getElementById('kbd-hint');
  if (kbd && /Mac|iPhone|iPad/.test(navigator.platform)) kbd.textContent = '⌘K';
}
