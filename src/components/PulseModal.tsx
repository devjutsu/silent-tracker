'use client';

import { useState } from 'react';
import { usePulseStore } from '@/store/pulse';

interface PulseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ActivityType = 'work' | 'study' | 'rest' | 'procrastination' | 'fitness';

const ACTIVITY_DESCRIPTIONS: Record<ActivityType, string> = {
  work: 'Professional tasks, meetings, or work-related activities',
  study: 'Learning, reading, or educational activities',
  rest: 'Relaxation, meditation, or taking a break',
  procrastination: 'Avoiding tasks, distractions, or unproductive activities',
  fitness: 'Exercise, sports, or physical activities'
};

export default function PulseModal({ isOpen, onClose }: PulseModalProps) {
  const { addRecord, loading, error } = usePulseStore();
  const [focusLevel, setFocusLevel] = useState(3);
  const [activity, setActivity] = useState<ActivityType>('work');
  const [tag, setTag] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRecord(focusLevel, activity, tag || undefined);
    if (!error) {
      onClose();
      setActivity('work');
      setTag('');
      setFocusLevel(3);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Record Your Focus Level</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Focus Level */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Focus Level (1-5)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="5"
                value={focusLevel}
                onChange={(e) => setFocusLevel(parseInt(e.target.value))}
                className="range range-primary"
                step="1"
              />
              <span className="text-lg font-bold">{focusLevel}</span>
            </div>
            <div className="flex justify-between text-xs px-2 mt-1">
              <span>Low Focus</span>
              <span>High Focus</span>
            </div>
          </div>

          {/* Activity */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">What are you doing?</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityType)}
              required
            >
              {Object.entries(ACTIVITY_DESCRIPTIONS).map(([value, description]) => (
                <option key={value} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>
            <label className="label">
              <span className="label-text-alt text-base-content/70">
                {ACTIVITY_DESCRIPTIONS[activity]}
              </span>
            </label>
          </div>

          {/* Tag */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Tag (optional)</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              placeholder="e.g., project name, subject, exercise type"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="modal-action">
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Saving...
                </>
              ) : (
                'Save Record'
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}>
        <button className="cursor-default">close</button>
      </div>
    </div>
  );
} 