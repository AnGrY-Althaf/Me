import React from 'react';
import { CONTACT, CREED, INTRO, PROFILE, QUICK_FACTS } from '../../content';

const Whoami: React.FC = () => (
  <article className="page">
    <h1>whoami</h1>

    <img className="hero-shot" src={PROFILE.photo} alt={PROFILE.name} />

    <h3>
      {PROFILE.name} ({PROFILE.alias})
    </h3>

    {INTRO.map((para, i) => (
      <p key={i} style={{ marginTop: i === 0 ? 16 : undefined }}>
        {para}
      </p>
    ))}

    <blockquote>{CREED}</blockquote>

    <h2>whereami</h2>
    <ul className="pairs">
      {CONTACT.map((c) => (
        <li key={c.label}>
          <span className="k">{c.label}:</span>
          <span className="v">
            {c.href ? (
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {c.value}
              </a>
            ) : (
              c.value
            )}
          </span>
        </li>
      ))}
    </ul>

    <h2>at a glance</h2>
    <ul className="facts">
      {QUICK_FACTS.map((f) => (
        <li key={f.label}>
          <span className="k">{f.label}:</span>
          <span>{f.value}</span>
        </li>
      ))}
    </ul>
  </article>
);

export default Whoami;
