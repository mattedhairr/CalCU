import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'calcu-theme';
const THEME_COLOR: Record<Theme, string> = { dark: '#000000', light: '#f2f2f7' };

// index.html sets the starting class (saved choice, else the system theme)
// before first paint; this hook takes over from there.
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('light') ? 'light' : 'dark'
  );

  useEffect(() => {
    document.documentElement.className = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', THEME_COLOR[theme]);
  }, [theme]);

  // Only an explicit choice is saved, so the system theme keeps applying
  // until the visitor picks one.
  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Storage can be unavailable (private mode); the toggle still works.
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
