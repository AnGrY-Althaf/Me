import React, { useEffect, useRef } from 'react';
import {
  ARSENAL,
  CREDENTIALS,
  EXPERIENCE,
  HALL,
  METRICS,
  PROFILE,
  SECTIONS,
  SERVICES,
} from '../content';
import { stationHalfWindow, stationT } from '../flight/path';
import type { Frame } from '../hooks/useFlightScroll';

interface Props {
  subscribe: (fn: (f: Frame) => void) => () => void;
  onOpenTerminal: () => void;
}

const Eyebrow: React.FC<{ i: number }> = ({ i }) => (
  <div className="eyebrow">
    <span className="rule" />
    <span className="idx">{String(i + 1).padStart(2, '0')}</span>
    <span>{SECTIONS[i].label}</span>
  </div>
);

const Panels: React.FC<Props> = ({ subscribe, onOpenTerminal }) => {
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const n = SECTIONS.length;
    const half = stationHalfWindow(n);

    return subscribe((f) => {
      for (let i = 0; i < n; i++) {
        const el = refs.current[i];
        if (!el) continue;

        // -1 .. 1 across this station's slice of the track.
        const d = (f.progress - stationT(i, n)) / half;
        const a = Math.abs(d);
        const opacity = Math.max(0, Math.min(1, 1 - a * 1.45));

        if (opacity <= 0.001) {
          if (el.style.visibility !== 'hidden') {
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
          }
          continue;
        }

        el.style.visibility = 'visible';
        el.style.opacity = String(opacity);
        // Content drifts up as you fly past it, and softens at the edges.
        el.style.transform = `translate3d(0, ${(-d * 58).toFixed(2)}px, 0) scale(${(
          1 - a * 0.035
        ).toFixed(4)})`;
        el.style.filter = a > 0.08 ? `blur(${(a * 5).toFixed(2)}px)` : 'none';
      }
    });
  }, [subscribe]);

  const set = (i: number) => (el: HTMLElement | null) => {
    refs.current[i] = el;
  };

  return (
    <div className="panels">
      {/* 01 — intro */}
      <section className="panel" ref={set(0)}>
        <div className="panel-inner">
          <Eyebrow i={0} />
          <h1 className="display">
            <span className="line">
              <span>ALTHAF</span>
            </span>
            <span className="line">
              <span className="outline">SHAJAHAN</span>
            </span>
          </h1>
          <p className="sub">
            Security researcher operating as <strong>{PROFILE.alias}</strong>. {PROFILE.blurb}
          </p>
          <div className="metrics">
            {METRICS.map((m) => (
              <div className="metric" key={m.k}>
                <span className="n">{m.n}</span>
                <span className="k">{m.k}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — about */}
      <section className="panel" ref={set(1)}>
        <div className="panel-inner">
          <Eyebrow i={1} />
          <h2 className="display">
            <span className="line">
              <span>BREAK IT</span>
            </span>
            <span className="line">
              <span className="outline">TO FIX IT</span>
            </span>
          </h2>
          <div className="body-grid">
            <div className="col-main">
              <p className="sub" style={{ marginTop: 0 }}>
                Six years deep in offensive security — finding the paths nobody documented and
                writing them up so they get closed. Bug bounty on live targets, red team work
                against real defences, and research that turns into tooling.
              </p>
              <p className="sub">
                Lately that means pointing the same lens at AI systems: agent tooling, MCP
                servers and the new attack surface nobody has finished mapping yet.
              </p>
            </div>
            <div className="facts">
              <h4>Operating principle</h4>
              <p className="sub" style={{ marginTop: 0 }}>
                Proof over theory. If it can't be reproduced, it isn't a finding.
              </p>
              <div className="tags">
                <span>{PROFILE.tagline}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — experience */}
      <section className="panel" ref={set(2)}>
        <div className="panel-inner">
          <Eyebrow i={2} />
          <h2 className="display">
            <span className="line">
              <span className="outline">TRACK</span>
            </span>
            <span className="line">
              <span>RECORD</span>
            </span>
          </h2>
          <div className="rows" style={{ marginTop: 30 }}>
            {EXPERIENCE.map((e) => (
              <div className="row" key={e.role + e.when}>
                <div className="when">{e.when}</div>
                <div className="what">
                  <h5>{e.role}</h5>
                  <p>{e.note}</p>
                </div>
                <div className="org">{e.org}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 — arsenal */}
      <section className="panel" ref={set(3)}>
        <div className="panel-inner">
          <Eyebrow i={3} />
          <h2 className="display">
            <span className="line">
              <span>ARSENAL</span>
            </span>
          </h2>
          <div className="body-grid" style={{ gap: 48 }}>
            {ARSENAL.map((g) => (
              <div className="col-main" key={g.group}>
                <h4>{g.group}</h4>
                <div className="tags">
                  {g.items.map((it) => (
                    <span key={it}>{it}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 — credentials */}
      <section className="panel" ref={set(4)}>
        <div className="panel-inner">
          <Eyebrow i={4} />
          <h2 className="display">
            <span className="line">
              <span className="outline">CREDENTIALS</span>
            </span>
          </h2>
          <div className="rows" style={{ marginTop: 30 }}>
            {CREDENTIALS.map((c) => (
              <div className="row" key={c.name}>
                <div className="when">cert</div>
                <div className="what">
                  <h5>{c.name}</h5>
                </div>
                <div className="org">{c.full}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06 — hall of fame */}
      <section className="panel" ref={set(5)}>
        <div className="panel-inner">
          <Eyebrow i={5} />
          <h2 className="display">
            <span className="line">
              <span>HALL OF</span>
            </span>
            <span className="line">
              <span className="outline">FAME</span>
            </span>
          </h2>
          <div className="wall">
            {HALL.map((h) => (
              <div className="cell" key={h.name}>
                <div className="name">{h.name}</div>
                <div className="meta">{h.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07 — services */}
      <section className="panel dense" ref={set(6)}>
        <div className="panel-inner">
          <Eyebrow i={6} />
          <h2 className="display">
            <span className="line">
              <span>WHAT I</span>
            </span>
            <span className="line">
              <span className="outline">DELIVER</span>
            </span>
          </h2>
          <div className="services">
            {SERVICES.map((s, i) => (
              <div className="svc" key={s.title}>
                <i>{String(i + 1).padStart(2, '0')}</i>
                <h5>{s.title}</h5>
                <p>{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 08 — contact */}
      <section className="panel" ref={set(7)}>
        <div className="panel-inner">
          <Eyebrow i={7} />
          <h2 className="display">
            <span className="line">
              <span>LET'S</span>
            </span>
            <span className="line">
              <span className="outline">TALK</span>
            </span>
          </h2>
          <p className="sub">
            Engagements, research collaborations, or a target you want looked at properly.
          </p>
          <div className="links">
            <a href={`mailto:${PROFILE.email}`}>Email</a>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a
              href="#terminal"
              onClick={(e) => {
                e.preventDefault();
                onOpenTerminal();
              }}
            >
              Open terminal
            </a>
          </div>
          <div className="sig">
            {PROFILE.tagline} — © {new Date().getFullYear()} {PROFILE.alias}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Panels;
