import React from 'react';
import Sidebar from './components/Sidebar';
import Arsenal from './components/pages/Arsenal';
import Experience from './components/pages/Experience';
import Whoami from './components/pages/Whoami';
import { useHashRoute } from './hooks/useHashRoute';
import { useTheme } from './hooks/useTheme';

const PAGES: Record<string, React.FC> = {
  whoami: Whoami,
  experience: Experience,
  arsenal: Arsenal,
};

const App: React.FC = () => {
  const route = useHashRoute();
  const { theme, toggle } = useTheme();
  const Page = PAGES[route] ?? Whoami;

  return (
    <>
      <Sidebar route={route} theme={theme} onToggleTheme={toggle} />
      <main className="main">
        {/* Keyed so each route replays its enter transition. */}
        <Page key={route} />
      </main>
    </>
  );
};

export default App;
