'use client';

import { useCaloryStore } from '@/features/calory/caloryStore';
import { useFeatureFlags } from '@/features/settings/featureFlags';
import { Plus, BarChart } from 'lucide-react';

export default function CaloryWidget() {
  const { isKeepFitEnabled } = useFeatureFlags();
  const { meals, dailyLimit, totalCalories } = useCaloryStore();

  if (!isKeepFitEnabled) return null;

  const groupedMeals: Record<string, { name: string; calories: number }[]> = {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
  };

  meals.forEach((meal) => {
    // временное распределение по типу
    const hour = new Date(meal.timestamp).getHours();
    const type = hour < 11 ? 'Breakfast' : hour < 17 ? 'Lunch' : 'Dinner';
    groupedMeals[type].push({ name: meal.name, calories: meal.calories });
  });

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            🍽️ Meals Today
          </h3>
          <div className="text-sm text-base-content/70">
            {totalCalories} / {dailyLimit} kcal
          </div>
        </div>

        <div className="divider my-2"></div>

        {(['Breakfast', 'Lunch', 'Dinner'] as const).map((mealType) => (
          <div key={mealType} className="mb-3">
            <p className="font-medium mb-1">
              {mealType === 'Breakfast' && '🥪 '}
              {mealType === 'Lunch' && '🥗 '}
              {mealType === 'Dinner' && '🍛 '}
              {mealType}
            </p>
            {groupedMeals[mealType].length === 0 ? (
              <p className="text-sm text-base-content/50">No meals</p>
            ) : (
              <ul className="text-sm space-y-1">
                {groupedMeals[mealType].map((meal, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{meal.name}</span>
                    <span className="text-base-content/70">
                      {meal.calories} kcal
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        <div className="mt-4 flex justify-between items-center">
          <button className="btn btn-sm btn-primary gap-1">
            <Plus size={16} />
            Add Meal
          </button>
          <button className="btn btn-sm btn-ghost text-sm gap-1">
            <BarChart size={16} />
            Weekly Stats
          </button>
        </div>
      </div>
    </div>
  );
}
