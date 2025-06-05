import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const DARK = 'dark';
export const LIGHT = 'light';
export type ThemeBase = typeof DARK | typeof LIGHT;
export const DARK_THEME = 'abyss';
export const LIGHT_THEME = 'emerald';
export type Theme = typeof DARK_THEME | typeof LIGHT_THEME;

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const getThemeFromStorage = (): Theme => {
  if (typeof window === 'undefined') return DARK_THEME;
  const savedTheme = localStorage.getItem('theme-storage');
  if (!savedTheme) return DARK_THEME;
  
  try {
    const { state } = JSON.parse(savedTheme);
    // Convert stored theme base to actual theme
    const theme = state.theme === 'dark' ? DARK_THEME : LIGHT_THEME;
    // Apply theme immediately
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    return theme;
  } catch {
    return DARK_THEME;
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: DARK_THEME, 
      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
      },
      toggleTheme: () => {
        const currentBase: ThemeBase = get().theme === DARK_THEME ? 'dark' : 'light';
        const newBase: ThemeBase = currentBase === 'dark' ? 'light' : 'dark';
        const newTheme = newBase === 'dark' ? DARK_THEME : LIGHT_THEME;
        set({ theme: newTheme });

        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', newTheme);
          toast.success(`Using ${newBase} theme`);
        }
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const parsed = JSON.parse(str);
            const base: ThemeBase = parsed?.state?.theme;
            const realTheme = base === 'dark' ? DARK_THEME : LIGHT_THEME;
            return JSON.stringify({ state: { theme: realTheme }, version: 0 });
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            const { state } = JSON.parse(value);
            const base: ThemeBase = state.theme === DARK_THEME ? 'dark' : 'light';
            const json = JSON.stringify({ state: { theme: base }, version: 0 });
            localStorage.setItem(name, json);
          } catch (err) {
            console.error('Failed to save theme:', err);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
    }
  )
);