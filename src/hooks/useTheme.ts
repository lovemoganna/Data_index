import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'auto';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme;
    return saved || 'auto';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      let newTheme: 'light' | 'dark';

      if (theme === 'auto') {
        newTheme = mediaQuery.matches ? 'dark' : 'light';
      } else {
        newTheme = theme;
      }

      setActualTheme(newTheme);

      // 应用主题到DOM
      const root = document.documentElement;
      if (newTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    updateTheme();

    // 监听系统主题变化
    if (theme === 'auto') {
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  const setThemeValue = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return {
    theme,
    actualTheme,
    setTheme: setThemeValue,
    isDark: actualTheme === 'dark',
    isLight: actualTheme === 'light',
    isAuto: theme === 'auto'
  };
}
