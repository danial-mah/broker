'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'dark' | 'light';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const storageKey = 'broker-theme';

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    const initialTheme = stored === 'light' || stored === 'dark' ? stored : 'dark';
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        setTheme((current) => {
          const next = current === 'dark' ? 'light' : 'dark';
          window.localStorage.setItem(storageKey, next);
          applyTheme(next);
          return next;
        });
      }
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return value;
}
