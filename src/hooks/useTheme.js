import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('atmos_theme') || 'system';
    } catch {
      return 'system';
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('atmos_theme') || 'system';
    if (stored === 'dark') return 'dark';
    if (stored === 'light') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
      const resolved = isDark ? 'dark' : 'light';
      setResolvedTheme(resolved);

      const metaTheme = document.querySelector('meta[name="color-scheme"]');
      if (metaTheme) {
        metaTheme.setAttribute('content', isDark ? 'dark' : 'light');
      }

      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    updateTheme();
    try {
      localStorage.setItem('atmos_theme', theme);
    } catch {
      // Ignore storage errors in private browsing
    }

    const handleMediaChange = () => {
      if (theme === 'system') {
        updateTheme();
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === 'atmos_theme' && e.newValue) {
        setTheme(e.newValue);
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [theme]);

  const toggleTheme = () => {
    // Cycles between light, dark, system
    setTheme((prev) => {
      if (prev === 'system') return resolvedTheme === 'dark' ? 'light' : 'dark';
      if (prev === 'dark') return 'light';
      return 'dark';
    });
  };

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
  };
}
