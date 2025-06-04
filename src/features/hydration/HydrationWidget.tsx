'use client';

import { useHydrationStore } from '@/features/hydration/hydrationStore';
import { useFeatureFlags } from '@/features/settings/featureFlags';
import { Plus, BarChart } from 'lucide-react';

export default function HydrationWidget() {
  const { isKeepFitEnabled } = useFeatureFlags();
  const { drinks, dailyGoal, totalAmount } = useHydrationStore();

  if (!isKeepFitEnabled) return null;

  const lastDrink = drinks.length > 0
    ? new Date(drinks[drinks.length - 1].timestamp)
    : null;

  const minutesAgo = lastDrink
    ? Math.floor((Date.now() - lastDrink.getTime()) / 60000)
    : null;

  const progress = Math.min((totalAmount / dailyGoal) * 100, 100);

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            💧 Hydration Today
          </h3>
          <div className="text-sm text-base-content/70">
            {totalAmount} / {dailyGoal} ml
          </div>
        </div>

        <progress
          className="progress progress-info w-full mb-2"
          value={progress}
          max={100}
        />

        <p className="text-sm mb-4 text-base-content/70">
          {lastDrink
            ? `Last drink: ${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`
            : 'No drinks yet today'}
        </p>

        <div className="space-y-1 mb-4">
          <p className="font-medium">🧃 Drinks:</p>
          {drinks.length === 0 ? (
            <p className="text-sm text-base-content/50">No drinks recorded</p>
          ) : (
            <ul className="text-sm text-base-content space-y-1">
              {drinks.slice(-3).reverse().map((drink) => (
                <li key={drink.id} className="flex justify-between">
                  <span>{drink.amount} ml</span>
                  <span className="text-base-content/50">
                    {new Date(drink.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button className="btn btn-sm btn-primary gap-1">
            <Plus size={16} />
            Add Drink
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
