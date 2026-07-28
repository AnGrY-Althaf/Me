import React from 'react';
import { SERVICES, SKILLS } from '../../content';

const Arsenal: React.FC = () => (
  <article className="page">
    <h1>arsenal</h1>

    <p>What I work with, and what I can be hired to do.</p>

    {SKILLS.map((g) => (
      <div key={g.group}>
        <p className="group-label">{g.group}</p>
        <ul className="chips">
          {g.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    ))}

    <h2>services</h2>
    <ul className="entries">
      {SERVICES.map((s) => (
        <li className="entry" key={s.title}>
          <div className="entry-head">
            <h3>{s.title}</h3>
            <span className="entry-meta">{s.scope}</span>
          </div>
          <p className="entry-note">{s.note}</p>
        </li>
      ))}
    </ul>
  </article>
);

export default Arsenal;
