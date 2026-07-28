import React, { useCallback, useEffect, useState } from 'react';
import Canvas from './components/Canvas';
import Loader from './components/Loader';
import Overlay from './components/Overlay';
import Panels from './components/Panels';
import TerminalChat from './components/TerminalChat';
import { PROFILE, SECTIONS } from './content';
import { useFlightScroll } from './hooks/useFlightScroll';

const App: React.FC = () => {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [painted, setPainted] = useState(false);
  const [fontsIn, setFontsIn] = useState(false);

  const { scrollerRef, spacerHeight, subscribe, active, scrollToSection } = useFlightScroll({
    sectionCount: SECTIONS.length,
    enabled: !terminalOpen,
  });

  useEffect(() => {
    let cancelled = false;
    const done = () => !cancelled && setFontsIn(true);
    if (document.fonts?.ready) document.fonts.ready.then(done, done);
    else done();
    // Never let a slow font host hold the door shut.
    const t = setTimeout(done, 4000);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  const openTerminal = useCallback(() => setTerminalOpen(true), []);
  const onReady = useCallback(() => setPainted(true), []);

  return (
    <div className="stage">
      <Canvas sectionCount={SECTIONS.length} subscribe={subscribe} onReady={onReady} />

      <Panels subscribe={subscribe} onOpenTerminal={openTerminal} />

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

      <TerminalChat isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />

      <Loader ready={painted && fontsIn} word={PROFILE.alias.toUpperCase()} />
    </div>
  );
};

export default App;
