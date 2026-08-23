import { useEffect, useState } from 'react';

/**
 * Hash routing, so the built site works on any static host without needing
 * rewrite rules for deep links. `#/` is the feed; `#/<slug>` is a post.
 */
function read(): string {
  return decodeURIComponent(window.location.hash.replace(/^#\/?/, '')).trim();
}

export function useHashRoute(): string {
  const [route, setRoute] = useState(read);

  useEffect(() => {
    const onChange = () => {
      setRoute(read());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}
