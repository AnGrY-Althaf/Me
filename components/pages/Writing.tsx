import React from 'react';
import { POSTS, PROFILE } from '../../content';

const Writing: React.FC = () => {
  return (
    <article className="page">
      <h1>writing</h1>

      <p>
        Bug bounty writeups and research notes. Everything lives on{' '}
        <a href={PROFILE.medium} target="_blank" rel="noopener noreferrer">
          Medium
        </a>
        .
      </p>

      <ul className="entries">
        {POSTS.map((post) => (
          <li className="entry" key={post.title}>
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
            {post.blurb && <p className="entry-note">{post.blurb}</p>}
          </li>
        ))}
      </ul>
    </article>
  );
};

export default Writing;
