'use client';

import { useEffect, useState } from 'react';
import { useThemeStore } from '@/features/theme/theme';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useThemeStore();

  // Handle initial theme load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-storage');
    if (savedTheme) {
      try {
        const { state } = JSON.parse(savedTheme);
        setTheme(state.theme);
      } catch (error) {
        console.error('Error parsing theme from localStorage:', error);
      }
    }
  }, [setTheme]);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial client render, render without theme
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <div data-theme={theme}>
      {children}
    </div>
  );
} 