// hydrationStore.ts
import { create } from 'zustand';

export type Drink = {
  id: number;
  amount: number; // in ml
  timestamp: string;
};

type HydrationState = {
  drinks: Drink[];
  dailyGoal: number;
  totalAmount: number;
  addDrink: (drink: Drink) => void;
  setDailyGoal: (goal: number) => void;
};

export const useHydrationStore = create<HydrationState>((set) => ({
  drinks: [],
  dailyGoal: 2000,
  totalAmount: 0,
  addDrink: (drink) =>
    set((state) => ({
      drinks: [...state.drinks, drink],
      totalAmount: state.totalAmount + drink.amount,
    })),
  setDailyGoal: (goal) => set({ dailyGoal: goal }),
}));
