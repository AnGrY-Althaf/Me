import React from 'react';
import { POSTS } from '../../content';

const Writing: React.FC = () => {
  const anyLive = POSTS.some((p) => p.href);

  return (
    <article className="page">
      <h1>writing</h1>

      {!anyLive && (
        <p className="placeholder-note">
          These are placeholder entries. Edit <code>POSTS</code> in <code>content.ts</code> — set
          each post's <code>href</code> and the title becomes a link.
        </p>
      )}

      <ul className="entries">
        {POSTS.map((post) => (
          <li className="entry" key={post.title}>
            <div className="entry-head">
              <span className="post-title">
                {post.href ? (
                  <a href={post.href} target="_blank" rel="noopener noreferrer">
                    {post.title}
                  </a>
                ) : (
                  post.title
                )}
              </span>
              <span className="entry-meta">
                {post.date} · <span className="tag">{post.tag}</span>
              </span>
            </div>
            {post.blurb && <p className="entry-note">{post.blurb}</p>}
          </li>
        ))}
      </ul>
    </article>
  );
};

export default Writing;
