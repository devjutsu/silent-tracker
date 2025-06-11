'use client';

import { useState, useEffect } from 'react';
import { useFlowStore } from '@/features/flow/flow';
import { useNotificationStore } from '@/features/notifications/notifications';
import toast from 'react-hot-toast';

type ActivityType = 'work' | 'study' | 'rest' | 'procrastination' | 'fitness';

interface FlowModalProps {
  onClose: () => void;
}

export default function FlowModal({ onClose }: FlowModalProps) {
  const { startFlow, entries } = useFlowStore();
  const { setModalOpen } = useNotificationStore();
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [activity, setActivity] = useState<ActivityType>('work');

  // Get the most recent flow entry when modal opens
  useEffect(() => {
    if (entries.length > 0) {
      const mostRecentFlow = entries[0]; // entries are already sorted by created_at desc
      setTitle(mostRecentFlow.title || '');
      setGoal(mostRecentFlow.goal || '');
    }
  }, [entries]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setModalOpen(true);
    return () => {
      document.body.style.overflow = 'unset';
      setModalOpen(false);
    };
  }, [setModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await startFlow(goal, title.trim() || undefined, activity);
      toast.success('Flow started successfully');
    } catch (error) {
      toast.error(`Failed to start flow: ${error}`);
    }
  };

  const activityDescriptions: Record<ActivityType, string> = {
    work: 'Professional tasks and work-related activities',
    study: 'Learning, reading, or educational activities',
    rest: 'Relaxation, breaks, or leisure time',
    procrastination: 'Time spent avoiding tasks or being unproductive',
    fitness: 'Exercise, sports, or physical activities',
  };

  return (
    <div className="bg-base-100 rounded-lg p-6 w-full max-w-md shadow-xl">
      <h2 className="text-xl sm:text-2xl font-bold mb-2">Start Focus Flow</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <span className="label-text">Title (optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Project X Development, Study Session"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Goal (optional)</span>
          </label>
          <input
            type="text"
            placeholder="What do you want to achieve in this flow?"
            className="input input-bordered w-full"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
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
          <button type="submit" className="btn btn-primary">
            Start Flow
          </button>
        </div>
      </form>
    </div>
  );
}
