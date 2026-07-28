import React, { useEffect, useRef } from 'react';
import { Flight } from '../flight/Flight';
import type { Frame } from '../hooks/useFlightScroll';

interface Props {
  subscribe: (fn: (f: Frame) => void) => () => void;
  onReady: () => void;
  onCaseClick: (index: number) => void;
  onEmailClick: () => void;
  onPostClick: (url: string) => void;
}

const Canvas: React.FC<Props> = ({ subscribe, onReady, onCaseClick, onEmailClick, onPostClick }) => {
  const holder = useRef<HTMLDivElement>(null);
  const cbs = useRef({ onReady, onCaseClick, onEmailClick, onPostClick });
  cbs.current = { onReady, onCaseClick, onEmailClick, onPostClick };

  useEffect(() => {
    const el = holder.current;
    if (!el) return;

    let flight: Flight | null = null;
    try {
      flight = new Flight(el);
    } catch (err) {
      console.warn('WebGL unavailable.', err);
      cbs.current.onReady();
      return;
    }
    flight.onCaseClick = (i) => cbs.current.onCaseClick(i);
    flight.onEmailClick = () => cbs.current.onEmailClick();
    flight.onPostClick = (url) => cbs.current.onPostClick(url);

    let first = true;
    const off = subscribe((f) => {
      flight!.update(f);
      if (first) {
        first = false;
        cbs.current.onReady();
      }
    });

    return () => {
      off();
      flight?.dispose();
    };
  }, [subscribe]);

  return <div className="canvas-holder" ref={holder} />;
};

export default Canvas;
