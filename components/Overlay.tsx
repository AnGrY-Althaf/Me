import React, { useEffect, useRef, useState } from 'react';
import { PROFILE, SECTIONS } from '../content';
import type { Frame } from '../hooks/useFlightScroll';

interface Props {
  subscribe: (fn: (f: Frame) => void) => () => void;
  active: number;
  onJump: (index: number) => void;
  onOpenTerminal: () => void;
}

/** Fixed HUD: brand, status, progress rail, section nav, scroll hint. */
const Overlay: React.FC<Props> = ({ subscribe, active, onJump, onOpenTerminal }) => {
  const fill = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(
    () =>
      subscribe((f) => {
        const p = Math.max(0, Math.min(1, f.progress));
        if (fill.current) fill.current.style.height = `${p * 100}%`;
        if (hint.current) hint.current.classList.toggle('hidden', f.raw > 0.02);
      }),
    [subscribe]
  );

  return (
    <div className="overlay">
      <div className="header">
        <div className="brand">
          <svg className="mark" viewBox="0 0 32 32" aria-hidden="true">
            <rect x="3" y="3" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <ellipse cx="16" cy="16" rx="7.5" ry="10" fill="none" stroke="currentColor" strokeWidth="1.4" />
          </svg>
          {PROFILE.brand}
        </div>
        <div className="status">{PROFILE.status}</div>
      </div>

      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" ref={fill} />
      </div>

      <nav className="section-nav" aria-label="Sections">
        {open && (
          <div className="section-menu">
            {SECTIONS.map((s, i) => (
              <button
                key={s.id}
                className={i === active ? 'active' : undefined}
                style={{ animationDelay: `${i * 28}ms` }}
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
        <button className="section-label" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
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
        terminal
      </button>
    </div>
  );
};

export default Overlay;
