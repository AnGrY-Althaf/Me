import React from 'react';
import { Github, Linkedin, Mail, Moon, Sun } from 'lucide-react';
import { NAV, PROFILE } from '../content';

interface Props {
  route: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Sidebar: React.FC<Props> = ({ route, theme, onToggleTheme }) => (
  <aside className="sidebar">
    <img className="avatar" src={PROFILE.photo} alt={PROFILE.name} />

    {/* Deliberately not an <h1>: the page's own title owns that, so each
        route has exactly one top-level heading. */}
    <div className="site-title">
      {PROFILE.name}
      <span className="caret" aria-hidden="true">
        |
      </span>
    </div>

    <p className="lead">{PROFILE.tagline}</p>

    <hr />

    {/* An entry with an `href` leaves the site — writing lives on the blog
        subdomain. It is styled like the rest so the rail reads as one nav,
        and never renders as the active route, because it is not one. */}
    <nav className="side-nav">
      {NAV.map((item) =>
        item.href ? (
          <a key={item.id} href={item.href}>
            {item.label}
          </a>
        ) : (
          <a
            key={item.id}
            href={`#/${item.id}`}
            className={item.id === route ? 'active' : undefined}
            aria-current={item.id === route ? 'page' : undefined}
          >
            {item.label}
          </a>
        )
      )}
    </nav>

    <hr />

    <div className="side-icons">
      <a href={`mailto:${PROFILE.email}`} aria-label="Email">
        <Mail size={20} />
      </a>
      <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <Linkedin size={20} />
      </a>
      <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <Github size={20} />
      </a>
      <button
        onClick={onToggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </div>

    <p className="copyright">
      © {new Date().getFullYear()} {PROFILE.alias}.
    </p>
  </aside>
);

export default Sidebar;
