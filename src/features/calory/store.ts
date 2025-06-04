import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Meal, DailyCalorieLimit } from './types';

interface CaloryState {
  meals: Meal[];
  dailyLimit: DailyCalorieLimit;
  addMeal: (meal: Omit<Meal, 'id' | 'timestamp'>) => void;
  removeMeal: (id: string) => void;
  setDailyLimit: (limit: number) => void;
  getTodayMeals: () => Meal[];
  getTodayTotal: () => number;
}

export const useCaloryStore = create<CaloryState>()(
  persist(
    (set, get) => ({
      meals: [],
      dailyLimit: {
        limit: 2000,
        lastUpdated: new Date().toISOString(),
      },
      addMeal: (meal) => {
        const newMeal: Meal = {
          ...meal,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          meals: [...state.meals, newMeal],
        }));
      },
      removeMeal: (id) => {
        set((state) => ({
          meals: state.meals.filter((meal) => meal.id !== id),
        }));
      },
      setDailyLimit: (limit) => {
        set({
          dailyLimit: {
            limit,
            lastUpdated: new Date().toISOString(),
          },
        });
      },
      getTodayMeals: () => {
        const today = new Date().toISOString().split('T')[0];
        return get().meals.filter((meal) =>
          meal.timestamp.startsWith(today)
        );
      },
      getTodayTotal: () => {
        return get()
          .getTodayMeals()
          .reduce((sum, meal) => sum + meal.calories, 0);
      },
    }),
    {
      name: 'calory-storage',
    }
  )
); 