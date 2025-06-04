'use client';

import { useFitStore } from '@/features/fit/fitStore';
import { useFeatureFlags } from '@/features/settings/featureFlags';
import { Plus, BarChart } from 'lucide-react';

export default function FitWidget() {
  const { isKeepFitEnabled } = useFeatureFlags();
  const { activities, totalMinutes } = useFitStore();

  if (!isKeepFitEnabled) return null;

  const today = new Date().toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            🏃 Fit Tracker
          </h3>
          <div className="text-sm text-base-content/70">
            {totalMinutes} min
          </div>
        </div>

        <div className="text-sm text-base-content/50 mb-4">
          {activities.length > 0
            ? `Today – ${today}`
            : 'No activities today'}
        </div>

        <div className="space-y-2">
          {activities.slice(-3).reverse().map((act) => (
            <div
              key={act.id}
              className="flex justify-between text-sm bg-base-200 p-2 rounded-md"
            >
              <span>{act.type}</span>
              <span className="text-base-content/70">{act.duration} min</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button className="btn btn-sm btn-primary gap-1">
            <Plus size={16} />
            Add Activity
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
