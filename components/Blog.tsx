import React, { useMemo, useState } from 'react';
import { BLOG, BlogPost } from '../content';

/* ------------------------------------------------------------------ glyphs
   Everything here is drawn on a 1px pixel grid rather than pulled from an
   icon set, so the hairlines line up with the table rules around them. */

const Chevron: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    className={`feed-chevron${open ? ' is-open' : ''}`}
    width="10"
    height="7"
    viewBox="0 0 10 7"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M9.84.89a.55.55 0 0 0-.79 0L5 4.94.95.89a.56.56 0 0 0-.79.79l4.45 4.44c.21.22.57.22.78 0L9.84 1.68a.56.56 0 0 0 0-.79Z"
      fill="currentColor"
    />
  </svg>
);

const FolderIcon: React.FC = () => (
  <svg
    className="feed-folder"
    width="12"
    height="10"
    viewBox="0 0 12 10"
    fill="none"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 0h6v1H1V0ZM1 6V1H0v8h1v1h10V9h1V3h-1V2H8V1H7v1h1v1h3v1H3v1H2v1H1Zm0 1v2h10V5H3v1H2v1H1Z"
      fill="currentColor"
    />
  </svg>
);

const CheckboxIcon: React.FC<{ on: boolean }> = ({ on }) => (
  <svg
    className={`feed-checkbox${on ? ' is-on' : ''}`}
    width="10"
    height="9"
    viewBox="0 0 10 9"
    fill="none"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 1H0v7h1v1h8V8h1V1H9V0H1v1Zm0 0h8v7H1V1Z"
      fill="currentColor"
    />
    {on && <rect x="2.5" y="2.5" width="5" height="4" fill="currentColor" />}
  </svg>
);

/** Stair-stepped diagonal arrow — the pixel "opens elsewhere" mark. */
const HoverArrow: React.FC = () => (
  <span className="feed-arrow" aria-hidden="true">
    <svg viewBox="0 0 6 6" fill="none">
      <rect y="5" width="1" height="1" fill="currentColor" />
      <rect x="1" y="4" width="1" height="1" fill="currentColor" />
      <rect x="2" y="3" width="1" height="1" fill="currentColor" />
      <rect x="3" y="2" width="1" height="1" fill="currentColor" />
      <rect x="4" y="1" width="1" height="1" fill="currentColor" />
      <rect x="5" width="1" height="6" fill="currentColor" />
      <rect width="6" height="1" fill="currentColor" />
    </svg>
  </span>
);

/** Plus that becomes a minus: only the vertical stroke rotates away. */
const AccordionMark: React.FC<{ open: boolean }> = ({ open }) => (
  <svg
    className="feed-accordion"
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    aria-hidden="true"
  >
    <path d="M0 5h10" stroke="currentColor" strokeWidth="1" />
    <path
      className={`feed-accordion-v${open ? ' is-open' : ''}`}
      d="M5 0v10"
      stroke="currentColor"
      strokeWidth="1"
    />
  </svg>
);

/* -------------------------------------------------------------- helpers */

/** 2026-05-22 -> 2026.5.22, matching the feed's un-padded numeric dates. */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${y}.${Number(m)}.${d}`;
}

/* ------------------------------------------------------------- art panel
   The plotted-window ornament that anchors the bottom of the filter rail.
   Purely decorative, hence hidden from the accessibility tree. */

const PLOT_NODES: Array<[number, number]> = [
  [12, 196],
  [80, 166],
  [148, 124],
  [216, 74],
  [288, 28],
];

const ArtPanel: React.FC = () => (
  <div className="feed-art" aria-hidden="true">
    <div className="feed-art-chrome">
      <span className="feed-art-dots">
        <i />
        <i />
      </span>
      <span className="smallcaps feed-art-fig">[ Fig. 1 ]</span>
      <span className="feed-art-dots">
        <i />
      </span>
    </div>

    <div className="feed-art-body">
      <span className="smallcaps feed-art-10x">10x</span>
      <svg className="feed-art-canvas" viewBox="0 0 302 232" preserveAspectRatio="none">
        <defs>
          <pattern id="feed-dots" width="12" height="12" patternUnits="userSpaceOnUse">
            <rect width="1" height="1" fill="currentColor" opacity="0.4" />
          </pattern>
        </defs>
        <rect width="302" height="232" fill="url(#feed-dots)" />
        <polyline
          className="feed-art-plot"
          points="12,196 46,188 80,166 114,172 148,124 182,132 216,74 250,88 288,28"
          fill="none"
          strokeWidth="1"
        />
        {PLOT_NODES.map(([x, y]) => (
          <rect key={x} className="feed-art-node" x={x - 2} y={y - 2} width="4" height="4" />
        ))}
      </svg>
    </div>
  </div>
);

/* ------------------------------------------------------------------ row */

interface RowProps {
  post: BlogPost;
  open: boolean;
  onToggle: () => void;
}

const Row: React.FC<RowProps> = ({ post, open, onToggle }) => (
  <li className="feed-item">
    <div className="feed-row">
      <a className="feed-row-link" href={post.href} target="_blank" rel="noopener noreferrer">
        <span className="feed-row-date">
          <span className="feed-square" />
          <span className="smallcaps">{formatDate(post.date)}</span>
        </span>
        <span className="feed-row-title">
          {post.title}
          <HoverArrow />
        </span>
      </a>

      <button
        className="feed-row-toggle"
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={`${open ? 'Collapse' : 'Expand'} details for ${post.title}`}
      >
        <AccordionMark open={open} />
      </button>
    </div>

    {/* 0fr -> 1fr so the reveal animates without measuring heights. */}
    <div className={`feed-collapse${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="feed-clip">
        <div className="feed-detail">
          <span className="smallcaps feed-detail-label">Summary:</span>
          <p className="feed-detail-summary">{post.summary}</p>

          <span className="smallcaps feed-detail-label">Author:</span>
          <p className="feed-detail-author">{post.author}</p>

          <span className="smallcaps feed-detail-label">Topics:</span>
          <ul className="feed-detail-topics">
            {post.topics.map((topic) => (
              <li key={topic}>
                <span className="smallcaps feed-tag">{topic}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </li>
);

/* ----------------------------------------------------------------- page */

const Blog: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [topicsOpen, setTopicsOpen] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of BLOG) {
      for (const topic of post.topics) counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  const posts = useMemo(() => {
    const sorted = [...BLOG].sort((a, b) => b.date.localeCompare(a.date));
    // No selection reads as "everything", not "nothing".
    if (selected.length === 0) return sorted;
    return sorted.filter((post) => post.topics.some((t) => selected.includes(t)));
  }, [selected]);

  const toggleTopic = (topic: string) =>
    setSelected((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );

  return (
    <div className="feed">
      <div className="feed-title-row">
        <h1 className="feed-title">
          blog
          <sup className="feed-count">({posts.length})</sup>
        </h1>
      </div>

      <div className="feed-sidebar">
        <div className="feed-filters">
          <div className="feed-table-header">
            <span className="smallcaps feed-label">
              <span>/</span>Filters
            </span>
          </div>

          <div className="feed-directory">
            <button
              className="feed-directory-toggle"
              type="button"
              onClick={() => setTopicsOpen((v) => !v)}
              aria-expanded={topicsOpen}
            >
              <Chevron open={topicsOpen} />
              <FolderIcon />
              <span className="feed-directory-label">Topic</span>
            </button>

            <div className={`feed-collapse${topicsOpen ? ' is-open' : ''}`}>
              <div className="feed-clip">
                <ul className="feed-filter-list">
                  {topics.map(([topic, count]) => {
                    const on = selected.includes(topic);
                    return (
                      <li key={topic}>
                        <button
                          className={`feed-filter-option${on ? ' is-on' : ''}`}
                          type="button"
                          onClick={() => toggleTopic(topic)}
                          aria-pressed={on}
                        >
                          <CheckboxIcon on={on} />
                          <span>
                            {topic} <span className="feed-filter-count">({count})</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          <ArtPanel />
        </div>
      </div>

      <div className="feed-list">
        <div className="feed-table-header feed-list-header">
          <span className="smallcaps feed-label feed-label-date">
            <span>/</span>Date
          </span>
          <span className="smallcaps feed-label feed-label-name">
            <span>/</span>Name
          </span>
        </div>

        <ul className="feed-items">
          {posts.map((post) => (
            <Row
              key={post.href}
              post={post}
              open={expanded === post.href}
              onToggle={() => setExpanded((cur) => (cur === post.href ? null : post.href))}
            />
          ))}
        </ul>

        {posts.length === 0 && <p className="feed-empty">No posts match that filter.</p>}
      </div>
    </div>
  );
};

export default Blog;
