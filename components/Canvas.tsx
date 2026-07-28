import React, { useEffect, useRef } from 'react';
import { Flight } from '../flight/Flight';
import type { Frame } from '../hooks/useFlightScroll';

interface Props {
  sectionCount: number;
  subscribe: (fn: (f: Frame) => void) => () => void;
  onReady: () => void;
}

const Canvas: React.FC<Props> = ({ sectionCount, subscribe, onReady }) => {
  const holder = useRef<HTMLDivElement>(null);
  const ready = useRef(onReady);
  ready.current = onReady;

  useEffect(() => {
    const el = holder.current;
    if (!el) return;

    let flight: Flight | null = null;
    try {
      flight = new Flight(el, sectionCount);
    } catch (err) {
      // No WebGL: the HTML layer still reads fine on its own.
      console.warn('WebGL unavailable, running without the flight layer.', err);
      ready.current();
      return;
    }

    let first = true;
    const off = subscribe((f) => {
      flight!.update(f);
      if (first) {
        first = false;
        ready.current();
      }
    });

    return () => {
      off();
      flight?.dispose();
    };
  }, [sectionCount, subscribe]);

  return <div className="canvas-holder" ref={holder} aria-hidden="true" />;
};

export default Canvas;
