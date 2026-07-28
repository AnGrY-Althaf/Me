import React, { useEffect, useRef, useState } from 'react';
import { PROFILE, SECTIONS } from '../content';
import type { Frame } from '../hooks/useFlightScroll';

interface Props {
  subscribe: (fn: (f: Frame) => void) => () => void;
  active: number;
  onJump: (index: number) => void;
  onOpenTerminal: () => void;
}

const Overlay: React.FC<Props> = ({ subscribe, active, onJump, onOpenTerminal }) => {
  const fill = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastPct = -1;
    return subscribe((f) => {
      const p = Math.max(0, Math.min(1, f.progress));
      if (fill.current) fill.current.style.height = `${p * 100}%`;

      const pct = Math.round(p * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        if (readout.current) readout.current.textContent = `${String(pct).padStart(3, '0')}`;
      }
      if (hint.current) hint.current.classList.toggle('hidden', p > 0.015);
    });
  }, [subscribe]);

  return (
    <div className="overlay">
      <div className="header">
        <div className="brand">
          <span className="mark" aria-hidden="true" />
          {PROFILE.name}
          <span className="alias">/ {PROFILE.alias}</span>
        </div>
        <div className="status">{PROFILE.status}</div>
      </div>

      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" ref={fill} />
      </div>
      <div className="progress-readout" ref={readout} aria-hidden="true">
        000
      </div>

      <nav className="section-nav" aria-label="Sections">
        {open && (
          <div className="section-menu">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                className={i === active ? 'active' : undefined}
                style={{ animationDelay: `${i * 32}ms` }}
                onClick={() => {
                  onJump(i);
                  setOpen(false);
                }}
              >
                <i>{String(i + 1).padStart(2, '0')}</i>
                {s.label}
              </button>
            ))}
          </div>
        )}
        <button
          className="section-label"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          section
          <b>{SECTIONS[active]?.label}</b>
          <span className={`chev${open ? ' open' : ''}`} aria-hidden="true" />
        </button>
      </nav>

      <div className="hint" ref={hint}>
        <span>scroll to fly</span>
        <div className="line" aria-hidden="true" />
      </div>

      <button className="terminal-launch" onClick={onOpenTerminal}>
        <span className="dot" aria-hidden="true" />
        <span>terminal</span>
      </button>
    </div>
  );
};

export default Overlay;
