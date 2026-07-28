import React, { useCallback, useEffect, useState } from 'react';
import Canvas from './components/Canvas';
import CaseOverlay from './components/CaseOverlay';
import Loader from './components/Loader';
import Overlay from './components/Overlay';
import TerminalChat from './components/TerminalChat';
import { PROFILE, SECTIONS, TALK } from './content';
import { useFlightScroll } from './hooks/useFlightScroll';

const App: React.FC = () => {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [caseIndex, setCaseIndex] = useState<number | null>(null);
  const [painted, setPainted] = useState(false);
  const [fontsIn, setFontsIn] = useState(false);

  const modalOpen = terminalOpen || caseIndex !== null;

  const { scrollerRef, spacerHeight, subscribe, active, scrollToSection } = useFlightScroll({
    sectionCount: SECTIONS.length,
    enabled: !modalOpen,
  });

  // The scene rasterises text to canvas textures, so fonts must be loaded
  // before the flight builds — Canvas mounts only once this flips true.
  useEffect(() => {
    let cancelled = false;
    const done = () => !cancelled && setFontsIn(true);
    if (document.fonts?.ready) {
      Promise.all([
        document.fonts.load('900 100px "Unbounded"'),
        document.fonts.load('700 100px "Unbounded"'),
        document.fonts.load('300 40px "Space Grotesk"'),
        document.fonts.load('400 40px "Space Grotesk"'),
        document.fonts.load('500 40px "Space Grotesk"'),
      ]).then(done, done);
    } else done();
    const t = setTimeout(done, 4000);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  const openTerminal = useCallback(() => setTerminalOpen(true), []);
  const onReady = useCallback(() => setPainted(true), []);
  const onCaseClick = useCallback((i: number) => setCaseIndex(i), []);
  const onEmailClick = useCallback(() => {
    window.location.href = `mailto:${TALK.email}`;
  }, []);
  const onPostClick = useCallback((url: string) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <div className="stage">
      {fontsIn && (
        <Canvas
          subscribe={subscribe}
          onReady={onReady}
          onCaseClick={onCaseClick}
          onEmailClick={onEmailClick}
          onPostClick={onPostClick}
        />
      )}

      {/* Owns the scrollbar; its height is the length of the flight. */}
      <div className="scroller" ref={scrollerRef} tabIndex={-1}>
        <div className="scroller-spacer" style={{ height: spacerHeight }} />
      </div>

      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <Overlay
        subscribe={subscribe}
        active={active}
        onJump={scrollToSection}
        onOpenTerminal={openTerminal}
      />

      {caseIndex !== null && (
        <CaseOverlay index={caseIndex} onClose={() => setCaseIndex(null)} onNext={setCaseIndex} />
      )}

      <TerminalChat isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />

      <Loader ready={painted && fontsIn} word={PROFILE.alias.toUpperCase()} />
    </div>
  );
};

export default App;
