'use client';

import { useState, useEffect } from 'react';
import { useFlowStore } from '@/features/flow/flow';
import { useNotificationStore } from '@/features/notifications/notifications';
import { useFlowModalStore } from './flowModalStore';
import toast from 'react-hot-toast';

export default function FlowModal() {
  const { isOpen, closeModal } = useFlowModalStore();
  const { startFlow } = useFlowStore();
  const { setModalOpen } = useNotificationStore();
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');

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
      await startFlow(goal, title.trim() || undefined);
      toast.success('Flow started successfully');
      closeModal();
    } catch (error) {
      toast.error(`Failed to start flow: ${error}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Start Focus Flow</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <textarea
              placeholder="What do you want to achieve in this flow?"
              className="textarea textarea-bordered w-full"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Start Flow
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 