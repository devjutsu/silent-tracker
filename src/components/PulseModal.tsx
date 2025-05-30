'use client';

import { useState, useEffect } from 'react';
import { usePulseStore } from '@/store/pulse';
import { useNotificationStore } from '@/store/notifications';
import toast from 'react-hot-toast';

type ActivityType = 'work' | 'study' | 'rest' | 'procrastination' | 'fitness';

interface PulseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PulseModal({ isOpen, onClose }: PulseModalProps) {
  const { addRecord } = usePulseStore();
  const { setModalOpen } = useNotificationStore();
  const [focusLevel, setFocusLevel] = useState(3);
  const [activity, setActivity] = useState<ActivityType>('work');
  const [tag, setTag] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setModalOpen(true);
    } else {
      document.body.style.overflow = 'unset';
      setModalOpen(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
      setModalOpen(false);
    };
  }, [isOpen, setModalOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addRecord(focusLevel, activity, tag.trim() || undefined);
      toast.success('Pulse record added successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to add pulse record');
    }
  };

  const activityDescriptions: Record<ActivityType, string> = {
    work: 'Professional tasks and work-related activities',
    study: 'Learning, reading, or educational activities',
    rest: 'Relaxation, breaks, or leisure time',
    procrastination: 'Time spent avoiding tasks or being unproductive',
    fitness: 'Exercise, sports, or physical activities'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Record Your Focus Level</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="">
            <label className="label mr-2">
              <span className="label-text">Focus Level (1-5)</span>
            </label>
            <div className="rating rating-md">
              {[1, 2, 3, 4, 5].map((level) => (
                <input
                  key={level}
                  type="radio"
                  name="focus-level"
                  className="mask mask-star-2 bg-primary"
                  checked={focusLevel === level}
                  onChange={() => setFocusLevel(level)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text">Activity Type</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={activity}
              onChange={(e) => setActivity(e.target.value as ActivityType)}
            >
              <option value="work">Work</option>
              <option value="study">Study</option>
              <option value="rest">Rest</option>
              <option value="procrastination">Procrastination</option>
              <option value="fitness">Fitness</option>
            </select>
            <p className="text-sm text-base-content/70 mt-1">
              {activityDescriptions[activity]}
            </p>
          </div>

          <div>
            <label className="label">
              <span className="label-text">Tag (optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., project-name, meeting, exercise"
              className="input input-bordered w-full"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 