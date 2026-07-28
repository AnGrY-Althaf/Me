import { useEffect, useState } from 'react';
import { NAV } from '../content';

const IDS = NAV.map((n) => n.id);
const DEFAULT = IDS[0];

function read(): string {
  const id = window.location.hash.replace(/^#\/?/, '');
  return IDS.includes(id) ? id : DEFAULT;
}

/**
 * Hash routing, so the built site works on any static host without needing
 * server-side rewrites for deep links.
 */
export function useHashRoute() {
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
