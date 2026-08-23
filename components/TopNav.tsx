import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { NAV, PROFILE } from '../content';

interface Props {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const TopNav: React.FC<Props> = ({ theme, onToggleTheme }) => {
  /* The bracketed letters are real shortcuts, not decoration. Modifier
     combinations are left alone so browser and OS chords still work. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const el = document.activeElement as HTMLElement | null;
      const typing =
        el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));
      if (typing) return;

      const item = NAV.find((n) => n.hotkey === e.key.toLowerCase());
      if (!item || item.current) return;

      e.preventDefault();
      window.location.href = item.href;
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <nav className="topnav" aria-label="Site">
      <div className="topnav-left">
        <a className="topnav-logo" href={`${NAV[0].href}`} aria-label={PROFILE.name}>
          <span aria-hidden="true">A/</span>
        </a>

        {NAV.map((item) => (
          <a
            key={item.label}
            className={`smallcaps topnav-button${item.current ? ' is-active' : ''}`}
            href={item.href}
            aria-current={item.current ? 'page' : undefined}
          >
            <span className="topnav-hotkey" aria-hidden="true">
              [{item.hotkey}]
            </span>
            {item.label}
          </a>
        ))}
      </div>

      <button
        className="smallcaps topnav-button topnav-theme"
        onClick={onToggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
      </button>
    </nav>
  );
};

export default TopNav;
