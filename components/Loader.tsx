import React, { useEffect, useState } from 'react';

interface Props {
  /** Flips true once fonts are in and the first frame has rendered. */
  ready: boolean;
  word: string;
}

/**
 * Outlined wordmark + percent counter, dungyov-style: creeps on its own
 * while assets land, snaps to 100 when actually ready, then dissolves.
 */
const Loader: React.FC<Props> = ({ ready, word }) => {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let raf = 0;
    let value = 0;
    const tick = () => {
      const ceiling = ready ? 100 : 90;
      value += (ceiling - value) * (ready ? 0.12 : 0.02);
      setPct(Math.min(100, Math.round(value)));
      if (value < 99.4) raf = requestAnimationFrame(tick);
      else {
        setPct(100);
        setTimeout(() => setGone(true), 380);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  return (
    <div className={`loader${gone ? ' done' : ''}`} aria-hidden={gone}>
      <div className="word">{word}</div>
      <div className="pct">{pct}%</div>
    </div>
  );
};

export default Loader;
