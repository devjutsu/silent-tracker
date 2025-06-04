export const MEAL_ICONS = {
  breakfast: '🥪',
  lunch: '🥗',
  dinner: '🍽️',
  snack: '🍎',
};

export interface Meal {
  id: string;
  name: string;
  calories: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: string;
}

export interface DailyCalorieLimit {
  limit: number;
  lastUpdated: string;
}

export interface NewMealState {
  name: string;
  calories: string;
}