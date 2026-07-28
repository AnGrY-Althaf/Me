import React, { useEffect, useState } from 'react';
import { CASES } from '../content';

interface Props {
  index: number;
  onClose: () => void;
  onNext: (index: number) => void;
}

/**
 * The click-to-expand case viewer: a 16:9 slide card over a dimmed page,
 * with slide nav, a counter row and a next-case link — dungyov-style,
 * carrying experience entries instead of design cases.
 */
const CaseOverlay: React.FC<Props> = ({ index, onClose, onNext }) => {
  const c = CASES[index];
  const [slide, setSlide] = useState(0);
  const slides = 3;

  useEffect(() => setSlide(0), [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setSlide((s) => (s + 1) % slides);
      if (e.key === 'ArrowLeft') setSlide((s) => (s + slides - 1) % slides);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!c) return null;
  const next = (index + 1) % CASES.length;

  return (
    <div className="case-scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="case-box" data-own-scroll>
        <button className="case-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="case-media">
          {slide === 0 && (
            <div className="slide slide-title">
              <svg className="deco" viewBox="0 0 100 100" aria-hidden="true">
                {[0, 45, 90, 135].map((r) => (
                  <line
                    key={r}
                    x1="50"
                    y1={r % 90 === 0 ? 4 : 14}
                    x2="50"
                    y2={r % 90 === 0 ? 96 : 86}
                    stroke="currentColor"
                    strokeWidth="0.7"
                    transform={`rotate(${r} 50 50)`}
                  />
                ))}
              </svg>
              <div className="slide-eyebrow">{c.title}</div>
              <div className="slide-big">Case study</div>
              <div className="slide-foot">
                <span>ALTHAF SHAJAHAN</span>
                <span>{c.period.toUpperCase()}</span>
              </div>
            </div>
          )}
          {slide === 1 && (
            <div className="slide slide-facts">
              <h4>The post</h4>
              <p className="fact-role">{c.title}</p>
              <p className="fact-org">{c.company}</p>
              <p className="fact-note">{c.note}</p>
            </div>
          )}
          {slide === 2 && (
            <div className="slide slide-facts">
              <h4>Focus</h4>
              <div className="fact-tags">
                {c.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <p className="fact-note">{c.period}</p>
            </div>
          )}

          <button className="media-nav" onClick={() => setSlide((s) => (s + 1) % slides)} aria-label="Next slide">
            ›
          </button>
        </div>

        <div className="case-caption">
          <div className="case-title">{c.title}</div>
          <div className="case-meta">
            {String(slide + 1).padStart(2, '0')} / {String(slides).padStart(2, '0')} — {c.org} · {c.year}
          </div>
        </div>
        <button className="case-next" onClick={() => onNext(next)}>
          next case — {CASES[next].title} →
        </button>
      </div>
    </div>
  );
};

export default CaseOverlay;
