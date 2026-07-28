import React, { useEffect, useState } from 'react';

interface Props {
  /** Flips true once fonts are in and the first frame has rendered. */
  ready: boolean;
  word: string;
}

/**
 * Counts up while the real work finishes, then holds at 100 just long
 * enough to read before dissolving into the flight.
 */
const Loader: React.FC<Props> = ({ ready, word }) => {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let raf = 0;
    let value = 0;
    const tick = () => {
      // Creep toward 90 on its own; snap to 100 when actually ready.
      const ceiling = ready ? 100 : 90;
      value += (ceiling - value) * (ready ? 0.12 : 0.018);
      setPct(Math.min(100, Math.round(value)));
      if (value < 99.4) raf = requestAnimationFrame(tick);
      else {
        setPct(100);
        setTimeout(() => setGone(true), 420);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  return (
    <div className={`loader${gone ? ' done' : ''}`} aria-hidden={gone}>
      <div className="word">{word}</div>
      <div className="bar">
        <span style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
      <div className="pct">{pct}%</div>
    </div>
  );
};

export default Loader;
