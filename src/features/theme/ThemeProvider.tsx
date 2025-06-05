'use client';

import { useEffect, useState } from 'react';
import { LIGHT, useThemeStore } from '@/features/theme/theme';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    const saved = localStorage.getItem('theme-storage');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const storedTheme = parsed?.state?.theme;
        if (storedTheme === LIGHT) {
          setTheme('emerald');
        } else {
          setTheme('abyss');
        }
      } catch {}
    }
    setMounted(true);
  }, [setTheme]);

  if (!mounted) return null;

  return <div data-theme={theme}>{children}</div>;
}
