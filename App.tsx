import React, { useEffect } from 'react';
import Blog from './components/Blog';
import NotFound from './components/NotFound';
import Post from './components/Post';
import TopNav from './components/TopNav';
import { findPost } from './content';
import { useHashRoute } from './hooks/useHashRoute';
import { useTheme } from './hooks/useTheme';

const SITE_TITLE = 'Althaf Shajahan — Blog';

const App: React.FC = () => {
  const { theme, toggle } = useTheme();
  const route = useHashRoute();
  const post = route ? findPost(route) : undefined;

  /* A hash route never triggers a document load, so the tab title has to be
     kept in step by hand. */
  useEffect(() => {
    document.title = post ? `${post.title} — Althaf Shajahan` : SITE_TITLE;
  }, [post]);

  return (
    <>
      <TopNav theme={theme} onToggleTheme={toggle} />
      <main className="shell">
        {/* Keyed so moving between posts replays the enter transition and
            starts the new one from the top rather than mid-article. */}
        {!route ? (
          <Blog key="feed" />
        ) : post ? (
          <Post key={post.slug} post={post} />
        ) : (
          <NotFound key="404" slug={route} />
        )}
      </main>
    </>
  );
};

export default App;
