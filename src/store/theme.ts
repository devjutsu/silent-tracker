import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'emerald' | 'abyss';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'emerald',
      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
      },
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'emerald' ? 'abyss' : 'emerald';
          if (typeof window !== 'undefined') {
            document.documentElement.setAttribute('data-theme', newTheme);
          }
          return { theme: newTheme };
        });
      },
    }),
    {
      name: 'theme-storage',
    }
  )
); 