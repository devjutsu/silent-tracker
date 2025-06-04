import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Meal {
  id: number;
  name: string;
  calories: number;
  timestamp: string;
}

interface CaloryState {
  meals: Meal[];
  dailyLimit: number;
  totalCalories: number;
  addMeal: (meal: Meal) => void;
  removeMeal: (id: number) => void;
  setDailyLimit: (limit: number) => void;
}

export const useCaloryStore = create<CaloryState>()(
  persist(
    (set) => ({
      meals: [],
      dailyLimit: 2000,
      totalCalories: 0,
      addMeal: (meal) => {
        set((state) => ({
          meals: [...state.meals, meal],
          totalCalories: state.totalCalories + meal.calories,
        }));
      },
      removeMeal: (id) => {
        set((state) => {
          const meal = state.meals.find((m) => m.id === id);
          return {
            meals: state.meals.filter((m) => m.id !== id),
            totalCalories: meal
              ? state.totalCalories - meal.calories
              : state.totalCalories,
          };
        });
      },
      setDailyLimit: (limit) => set({ dailyLimit: limit }),
    }),
    {
      name: 'calory-storage',
    }
  )
); 