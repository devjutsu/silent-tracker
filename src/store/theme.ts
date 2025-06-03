import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import toast from 'react-hot-toast';

export const DARK_THEME = 'abyss';
export const LIGHT_THEME = 'emerald';
type Theme = typeof DARK_THEME | typeof LIGHT_THEME;

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
    return state.theme === 'dark' ? DARK_THEME : LIGHT_THEME;
  } catch {
    return DARK_THEME;
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: getThemeFromStorage(),
      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
      },
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
          if (typeof window !== 'undefined') {
            document.documentElement.setAttribute('data-theme', newTheme);
            toast.success(`Using ${newTheme === DARK_THEME ? 'dark' : 'light'} theme`);
          }
          return { theme: newTheme };
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const { state } = JSON.parse(str);
            return JSON.stringify({
              state: {
                theme: state.theme === 'dark' ? DARK_THEME : LIGHT_THEME
              },
              version: 0
            });
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            const { state } = JSON.parse(value as string);
            localStorage.setItem(name, JSON.stringify({
              state: {
                theme: state.theme === DARK_THEME ? 'dark' : 'light'
              },
              version: 0
            }));
          } catch (error) {
            console.error('Error saving theme to localStorage:', error);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
    }
  )
); 