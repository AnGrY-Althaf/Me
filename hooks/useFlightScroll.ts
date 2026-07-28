import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { stationT } from '../flight/path';

export interface Frame {
  /** Damped scroll position, 0..1. This is what the flight follows. */
  progress: number;
  /** Undamped scroll position, 0..1. */
  raw: number;
  /** Change in progress per second. */
  velocity: number;
  time: number;
  dt: number;
  pointer: { x: number; y: number };
}

type Subscriber = (f: Frame) => void;

interface Options {
  sectionCount: number;
  /** Viewport-heights of scroll distance given to each section. */
  pagesPerSection?: number;
  enabled?: boolean;
}

/** Time constant of the scroll damping — the floaty feel of the flight. */
const TAU = 0.85;

/**
 * Owns the single rAF loop for the whole page.
 *
 * The document never scrolls; a fixed overflow container does, and its
 * position is normalised to 0..1, damped, and pushed to subscribers.
 * Per-frame consumers write to the DOM/canvas directly so React only
 * re-renders when the active section changes.
 */
export function useFlightScroll({ sectionCount, pagesPerSection = 2.44, enabled = true }: Options) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const subsRef = useRef(new Set<Subscriber>());
  const frameRef = useRef<Frame>({
    progress: 0,
    raw: 0,
    velocity: 0,
    time: 0,
    dt: 0,
    pointer: { x: 0, y: 0 },
  });
  const pointerTarget = useRef({ x: 0, y: 0 });
  const enabledRef = useRef(enabled);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  enabledRef.current = enabled;

  const spacerHeight = useMemo(
    () => `${Math.round(sectionCount * pagesPerSection * 100)}vh`,
    [sectionCount, pagesPerSection]
  );

  const subscribe = useCallback((fn: Subscriber) => {
    subsRef.current.add(fn);
    return () => {
      subsRef.current.delete(fn);
    };
  }, []);

  const scrollToSection = useCallback((index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    // Jump the raw position; the damping flies the camera there.
    el.scrollTo({ top: stationT(index) * max, behavior: 'auto' });
  }, []);

  /* ------------------------------------------------------------ rAF loop */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let start = last;
    let smooth = 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const el = scrollerRef.current;
      const max = el ? el.scrollHeight - el.clientHeight : 0;
      const raw = el && max > 0 ? el.scrollTop / max : 0;

      const prev = smooth;
      smooth += (raw - smooth) * (1 - Math.exp(-dt / TAU));

      const p = pointerTarget.current;
      const f = frameRef.current;
      f.pointer.x += (p.x - f.pointer.x) * Math.min(1, dt * 3);
      f.pointer.y += (p.y - f.pointer.y) * Math.min(1, dt * 3);
      f.progress = smooth;
      f.raw = raw;
      f.velocity = dt > 0 ? (smooth - prev) / dt : 0;
      f.time = (now - start) / 1000;
      f.dt = dt;

      subsRef.current.forEach((fn) => fn(f));

      // Only pushes through React when the nearest station changes.
      let nearest = 0;
      let best = Infinity;
      for (let i = 0; i < sectionCount; i++) {
        const d = Math.abs(smooth - stationT(i));
        if (d < best) {
          best = d;
          nearest = i;
        }
      }
      if (nearest !== activeRef.current) {
        activeRef.current = nearest;
        setActive(nearest);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [sectionCount]);

  /* --------------------------------------------------- input forwarding */
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      pointerTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    // The canvas sits above the scroller, so wheel events land on it.
    // Forward everything to the scroller unless the cursor is over an
    // element that scrolls on its own (terminal log, case overlay).
    const onWheel = (e: WheelEvent) => {
      const el = scrollerRef.current;
      if (!el || !enabledRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-own-scroll]')) return;

      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      el.scrollTop += e.deltaY * unit;
    };

    const onKey = (e: KeyboardEvent) => {
      const el = scrollerRef.current;
      if (!el || !enabledRef.current) return;
      const page = window.innerHeight;
      const step: Record<string, number> = {
        ArrowDown: page * 0.3,
        ArrowUp: -page * 0.3,
        PageDown: page * 0.9,
        PageUp: -page * 0.9,
        ' ': page * 0.9,
      };
      if (e.key in step) {
        e.preventDefault();
        el.scrollTop += step[e.key];
      } else if (e.key === 'Home') {
        e.preventDefault();
        el.scrollTop = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        el.scrollTop = el.scrollHeight;
      }
    };

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  /* ------------------------------------------------------ touch dragging */
  useEffect(() => {
    let lastY = 0;
    let dragging = false;

    const onStart = (e: TouchEvent) => {
      if (!enabledRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('[data-own-scroll]')) return;
      dragging = true;
      lastY = e.touches[0].clientY;
    };
    const onMove = (e: TouchEvent) => {
      const el = scrollerRef.current;
      if (!dragging || !el) return;
      const y = e.touches[0].clientY;
      el.scrollTop += (lastY - y) * 1.4;
      lastY = y;
    };
    const onEnd = () => {
      dragging = false;
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, []);

  return { scrollerRef, spacerHeight, subscribe, active, scrollToSection, frameRef };
}
