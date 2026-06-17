import { gsap, ScrollTrigger } from './gsapSetup.js';
import { REDUCED, COARSE } from './env.js';

const FEED = 'https://medium.com/feed/@angry.althaf';

/* posts that must never render, even if the live feed returns them */
const EXCLUDE = ['clicker-htb-walkthrough-writeup'];

/* snapshot fallback — used instantly, replaced by live feed when reachable */
const FALLBACK = [
  {
    title: 'How I Chained Mass Assignment + PHP Type Juggling to Take Over Any Account on a Live Platform — 3-Digit Bounty',
    link: 'https://medium.com/@angry.althaf/how-i-chained-mass-assignment-php-type-juggling-to-take-over-any-account-on-a-live-platform-8ad4b193e171',
    date: '2026-05-22',
    image: 'https://cdn-images-1.medium.com/max/1024/1*6ExoUM8Wi2LrRoROANsK-Q.png',
    tags: ['bug-bounty', 'appsec', 'yeswehack'],
  },
  {
    title: 'Stored XSS via Markdown URL Attribute Injection — How I Earned a €450 Bug Bounty',
    link: 'https://medium.com/@angry.althaf/stored-xss-via-markdown-url-attribute-injection-how-i-earned-a-450-bug-bounty-48c40ae644ef',
    date: '2026-05-20',
    image: 'https://cdn-images-1.medium.com/max/1024/1*a39RhuFp4YfzLZOGsbFUIw.png',
    tags: ['xss-attack', 'appsec', 'bug-bounty'],
  },
];

const allowed = (p) => !EXCLUDE.some((slug) => (p.link || '').includes(slug));

function fmtDate(d) {
  const dt = new Date(typeof d === 'string' ? d.replace(' ', 'T') : d);
  if (isNaN(dt)) return '';
  return dt
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase();
}

async function fetchLive() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 5000);
  try {
    const res = await fetch(
      'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(FEED),
      { signal: ctrl.signal }
    );
    const data = await res.json();
    if (data.status !== 'ok' || !data.items?.length) throw new Error('bad feed');
    return data.items
      .map((it) => ({
        title: it.title,
        link: (it.link || '').split('?')[0],
        date: it.pubDate,
        image: it.thumbnail || (it.content?.match(/<img[^>]+src="([^"]+)"/) || [])[1] || '',
        tags: (it.categories || []).slice(0, 3),
      }))
      .filter(allowed)
      .slice(0, 6);
  } finally {
    clearTimeout(timer);
  }
}

export function initBlog() {
  const list = document.getElementById('blog-list');
  if (!list) return;
  let animated = false;
  let renderedKey = '';

  function render(posts) {
    const key = posts.map((p) => p.link).join('|');
    if (key === renderedKey) return; // live feed matches what's shown — keep DOM stable
    renderedKey = key;

    list.innerHTML = posts
      .map(
        (p, i) => `
      <a class="blog-row" href="${p.link}" target="_blank" rel="noopener noreferrer" data-image="${p.image}">
        <span class="blog-idx">${String(i + 1).padStart(2, '0')}</span>
        <span class="blog-main">
          <span class="blog-title">${p.title}</span>
          <span class="blog-date">${fmtDate(p.date)}</span>
        </span>
        <span class="blog-tags">${p.tags.map((t) => `<i class="blog-tag">${t}</i>`).join('')}</span>
        <span class="blog-arrow" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
        </span>
      </a>`
      )
      .join('');

    const rows = list.querySelectorAll('.blog-row');
    if (REDUCED || animated) {
      rows.forEach((r) => (r.style.opacity = 1));
    } else {
      animated = true;
      gsap.fromTo(rows, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: list, start: 'top 88%', once: true },
      });
    }
    initPreview(rows);
    ScrollTrigger.refresh();
  }

  /* cursor-following thumbnail preview */
  let preview = null;
  function initPreview(rows) {
    if (COARSE || REDUCED) return;
    if (!preview) {
      preview = document.createElement('div');
      preview.className = 'blog-preview';
      preview.innerHTML = '<img alt="">';
      gsap.set(preview, { xPercent: -50, yPercent: -118, scale: 0.9 });
      const xTo = gsap.quickTo(preview, 'x', { duration: 0.45, ease: 'power3' });
      const yTo = gsap.quickTo(preview, 'y', { duration: 0.45, ease: 'power3' });
      const rTo = gsap.quickTo(preview, 'rotation', { duration: 0.5, ease: 'power3' });
      list.addEventListener('mousemove', (e) => {
        const r = list.getBoundingClientRect();
        xTo(e.clientX - r.left);
        yTo(e.clientY - r.top);
        rTo(gsap.utils.clamp(-10, 10, e.movementX * 0.6));
      }, { passive: true });
      list.addEventListener('mouseleave', () => {
        gsap.to(preview, { opacity: 0, scale: 0.9, duration: 0.3 });
      });
    }
    list.appendChild(preview); // (re-)attach after innerHTML reset
    const img = preview.querySelector('img');
    rows.forEach((row) => {
      row.addEventListener('mouseenter', () => {
        const src = row.dataset.image;
        if (src) { img.src = src; img.style.display = ''; }
        else img.style.display = 'none';
        gsap.to(preview, { opacity: 1, scale: 1, duration: 0.35, ease: 'power3.out' });
      });
    });
  }

  render(FALLBACK);
  fetchLive()
    .then((posts) => { if (posts.length) render(posts); })
    .catch(() => { /* offline / rate-limited — fallback already rendered */ });
}
