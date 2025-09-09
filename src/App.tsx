import React, { useEffect } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { useAppStore } from './store/themeStore';
import appRoutes from './routes';
import { initDB } from './utils/indexedDB';

// This component will render the correct page based on the URL
const AppRoutes = () => {
  const element = useRoutes(appRoutes);
  return element;
};


// Initialize DB when the app loads
initDB().then(success => {
  if (success) {
    console.log('Database initialized successfully.');
  } else {
    console.error('Failed to initialize database.');
  }
});

const App = () => {
  const theme = useAppStore((state) => state.theme);

  // This hook correctly applies the dark/light theme class to the <html> element
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    // The BrowserRouter is essential for routing to work
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
