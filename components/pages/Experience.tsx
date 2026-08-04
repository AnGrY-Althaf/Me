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
    <p>{CVES.length} assigned CVEs from coordinated disclosure.</p>
    <ul className="entries">
      {CVES.map((cve, i) => (
        <li className="entry" key={cve.id || `cve-${i}`}>
          <div className="entry-head">
            <h3 className={cve.id ? undefined : 'pending'}>
              {cve.id ? (
                cve.href ? (
                  <a href={cve.href} target="_blank" rel="noopener noreferrer">
                    {cve.id}
                  </a>
                ) : (
                  cve.id
                )
              ) : (
                `CVE ${String(i + 1).padStart(2, '0')} — id pending`
              )}
            </h3>
            {cve.product && <span className="entry-meta">{cve.product}</span>}
          </div>
          {cve.summary && <p className="entry-note">{cve.summary}</p>}
        </li>
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
