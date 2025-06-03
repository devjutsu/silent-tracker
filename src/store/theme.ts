import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const DARK_THEME = 'abyss';
export const LIGHT_THEME = 'emerald';
type Theme = typeof DARK_THEME | typeof LIGHT_THEME;

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: DARK_THEME,
      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
          toast.success(`Switched to ${theme === DARK_THEME ? 'dark' : 'light'} theme`);
        }
      },
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
          if (typeof window !== 'undefined') {
            document.documentElement.setAttribute('data-theme', newTheme);
            toast.success(`Switched to ${newTheme === DARK_THEME ? 'dark' : 'light'} theme`);
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