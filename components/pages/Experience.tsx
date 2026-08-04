import React from 'react';
import { CREDENTIALS, CVES, EXPERIENCE, HALL_OF_FAME } from '../../content';

const Experience: React.FC = () => (
  <article className="page">
    <h1>experience</h1>

    <ul className="entries">
      {EXPERIENCE.map((job) => (
        <li className="entry" key={job.role + job.period}>
          <div className="entry-head">
            <h3>{job.role}</h3>
            <span className="entry-meta nowrap">{job.period}</span>
          </div>
          <p className="entry-org">{job.org}</p>
          <ul>
            {job.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>

    <h2>cves</h2>
    <ul className="chips mono">
      {CVES.map((id) => (
        <li key={id}>{id}</li>
      ))}
    </ul>

    <h2>certifications</h2>
    <ul className="pairs">
      {CREDENTIALS.map((c) => (
        <li key={c.code}>
          <span className="k">{c.code}:</span>
          <span className="v">{c.name}</span>
        </li>
      ))}
    </ul>

    <h2>hall of fame</h2>
    <ul className="entries">
      {HALL_OF_FAME.map((h) => (
        <li className="entry" key={h.org}>
          <div className="entry-head">
            <h3>{h.org}</h3>
            <span className="entry-meta">{h.rank}</span>
          </div>
          <p className="entry-note">{h.note}</p>
        </li>
      ))}
    </ul>
  </article>
);

export default Experience;
