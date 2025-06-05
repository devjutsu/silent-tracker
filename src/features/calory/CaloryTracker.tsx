'use client';

import { useState } from 'react';
import { useCaloryStore, Meal } from '@/features/calory/caloryStore';
import { Plus, Settings, BarChart } from 'lucide-react';
import { NewMealState } from './types';

export default function CaloryTracker() {
  const {
    meals,
    addMeal,
    removeMeal,
    dailyLimit,
    setDailyLimit,
    totalCalories,
  } = useCaloryStore();
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [isSettingLimit, setIsSettingLimit] = useState(false);
  const [newMeal, setNewMeal] = useState<NewMealState>({
    name: '',
    calories: '',
  });
  const [newLimit, setNewLimit] = useState(dailyLimit);
  const [limitInput, setLimitInput] = useState(dailyLimit.toString());

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMeal.name && newMeal.calories) {
      addMeal({
        id: Date.now(),
        name: newMeal.name,
        calories: parseInt(newMeal.calories, 10),
        timestamp: new Date().toISOString(),
      });
      setNewMeal({ name: '', calories: '' });
    }
  };

  const handleRemoveMeal = (id: number) => {
    removeMeal(id);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLimitInput(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      setDailyLimit(numValue);
    }
  };

  const progress = Math.min((totalCalories / dailyLimit) * 100, 100);
  const isOverLimit = totalCalories > dailyLimit;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">Calorie Tracker</h2>
          <div className="flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsAddingMeal(true)}
            >
              <Plus size={16} />
              Add Meal
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setIsSettingLimit(true)}
            >
              <Settings size={16} />
              Set Daily Limit
            </button>
          </div>
        </div>

        <div className="divider">
          Today –{' '}
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
          })}
        </div>

        {/* Daily Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Daily Progress</span>
            <span className="text-sm">
              {totalCalories} / {dailyLimit} kcal
            </span>
          </div>
          <progress
            className={`progress w-full ${
              isOverLimit ? 'progress-error' : 'progress-primary'
            }`}
            value={progress}
            max="100"
          ></progress>
        </div>

        {/* Daily Limit Setting */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Daily Calorie Limit</span>
          </label>
          <input
            type="number"
            placeholder="e.g., 2000"
            className="input input-bordered w-full"
            value={limitInput}
            onChange={handleLimitChange}
            min="1"
          />
        </div>

        {/* Add Meal Form */}
        <form onSubmit={handleAddMeal} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Add Meal</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Meal name"
                className="input input-bordered flex-1"
                value={newMeal.name}
                onChange={(e) =>
                  setNewMeal({ ...newMeal, name: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Calories"
                className="input input-bordered w-32"
                value={newMeal.calories}
                onChange={(e) =>
                  setNewMeal({ ...newMeal, calories: e.target.value })
                }
                min="1"
              />
              <button type="submit" className="btn btn-primary">
                Add
              </button>
            </div>
          </div>
        </form>

        {/* Meal List */}
        <div className="space-y-2">
          <h3 className="font-medium">Today&apos;s Meals</h3>
          {meals.length === 0 ? (
            <p className="text-sm text-base-content/70">No meals added today</p>
          ) : (
            <div className="space-y-2">
              {meals.map((meal: Meal) => (
                <div
                  key={meal.id}
                  className="flex items-center justify-between p-2 bg-base-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{meal.name}</p>
                    <p className="text-sm text-base-content/70">
                      {meal.calories} kcal
                    </p>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleRemoveMeal(meal.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="divider"></div>

        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold">Total: </span>
            <span
              className={
                totalCalories > dailyLimit ? 'text-error' : 'text-success'
              }
            >
              {totalCalories} / {dailyLimit} kcal
            </span>
          </div>
          <button className="btn btn-ghost btn-sm">
            <BarChart size={16} />
            View Weekly Stats
          </button>
        </div>

        {/* Add Meal Modal */}
        {isAddingMeal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">Add New Meal</h3>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Meal Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={newMeal.name}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, name: e.target.value })
                  }
                />
              </div>
              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Calories</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={newMeal.calories || ''}
                  onChange={(e) =>
                    setNewMeal({ ...newMeal, calories: e.target.value || '0' })
                  }
                />
              </div>
              <div className="modal-action">
                <button className="btn" onClick={() => setIsAddingMeal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleAddMeal}>
                  Add Meal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Set Daily Limit Modal */}
        {isSettingLimit && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-4">
                Set Daily Calorie Limit
              </h3>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Daily Limit (kcal)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  value={newLimit}
                  onChange={(e) => setNewLimit(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => setIsSettingLimit(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setDailyLimit(newLimit)}
                >
                  Set Limit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
