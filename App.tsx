import React from 'react';
import Blog from './components/Blog';
import TopNav from './components/TopNav';
import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
  const { theme, toggle } = useTheme();

  return (
    <>
      <TopNav theme={theme} onToggleTheme={toggle} />
      <main className="shell">
        <Blog />
      </main>
    </>
  );
};

export default App;
