import React from 'react';

/** Shown when a `#/<slug>` in the address bar matches no post. */
const NotFound: React.FC<{ slug: string }> = ({ slug }) => (
  <div className="notfound">
    <h1 className="notfound-code smallcaps">/ 404</h1>
    <p className="notfound-text">
      No post at <code>#/{slug}</code>.
    </p>
    <a className="smallcaps post-back" href="#/">
      <span aria-hidden="true">&larr;</span> All posts
    </a>
  </div>
);

export default NotFound;
