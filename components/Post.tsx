import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { BlogPost } from '../content';

/** 2026-05-22 -> 2026.5.22, matching the feed's un-padded numeric dates. */
function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${y}.${Number(m)}.${d}`;
}

/**
 * Markdown is rendered first and sanitized second.
 *
 * The order matters and is not a formality: sanitizing the markdown source
 * would be a no-op, because the dangerous HTML does not exist until `marked`
 * has built it. That is precisely the bug written up in one of these posts,
 * so it would be a poor look to reproduce it here.
 */
function render(markdown: string): string {
  const html = marked.parse(markdown, { async: false, gfm: true, breaks: false }) as string;
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

interface Props {
  post: BlogPost;
}

const Post: React.FC<Props> = ({ post }) => {
  const html = useMemo(() => render(post.body), [post.body]);

  return (
    <article className="post">
      <a className="smallcaps post-back" href="#/">
        <span aria-hidden="true">&larr;</span> All posts
      </a>

      <header className="post-header">
        <div className="post-meta">
          <span className="feed-square" />
          <span className="smallcaps">{formatDate(post.date)}</span>
          <span className="smallcaps post-meta-sep" aria-hidden="true">
            /
          </span>
          <span className="smallcaps">{post.readingTime}</span>
        </div>

        <h1 className="post-title">{post.title}</h1>
        <p className="post-summary">{post.summary}</p>

        <div className="post-byline">
          <span className="smallcaps post-label">Author:</span>
          <span className="post-author">{post.author}</span>
        </div>

        <div className="post-byline">
          <span className="smallcaps post-label">Topics:</span>
          <ul className="post-topics">
            {post.topics.map((topic) => (
              <li key={topic}>
                <span className="smallcaps feed-tag">{topic}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {post.hero && <img className="post-hero" src={post.hero} alt="" />}

      {/* Sanitized immediately above, and the source is a first-party file
          compiled into the bundle rather than anything a reader can supply. */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

      <footer className="post-footer">
        <a className="smallcaps post-back" href="#/">
          <span aria-hidden="true">&larr;</span> All posts
        </a>
      </footer>
    </article>
  );
};

export default Post;
