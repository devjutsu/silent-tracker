'use client';

import { useState, useEffect } from 'react';
import { usePulseStore } from '@/features/pulse/pulse';
import { useNotificationStore } from '@/features/notifications/notifications';
import { useFlowStore } from '@/features/flow/flow';
import toast from 'react-hot-toast';

type FlowState = 'start' | 'progress' | 'end';

interface PulseModalProps {
  onClose: () => void;
  flowId?: string;
  flowState?: FlowState;
}

export default function PulseModal({ onClose, flowId, flowState = 'progress' }: PulseModalProps) {
  const { addRecord } = usePulseStore();
  const { setModalOpen } = useNotificationStore();
  const { currentEntry } = useFlowStore();
  const [focusLevel, setFocusLevel] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [tag, setTag] = useState('');
  const [note, setNote] = useState('');

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
      const activeFlowId = currentEntry?.id;
      await addRecord(
        focusLevel,
        currentEntry?.activity || 'work',
        energyLevel,
        tag.trim() || undefined,
        note.trim() || undefined,
        activeFlowId || flowId
      );
      toast.success('Pulse record added successfully');
      onClose();
    } catch (error) {
      toast.error(`Failed to add pulse record ${error}`);
    }
  };

  const getTitle = () => {
    switch (flowState) {
      case 'start':
        return 'How is your focus now?';
      case 'end':
        return 'How was your focus?';
      case 'progress':
      default:
        return 'How is your focus now?';
    }
  };

  return (
    <div className="bg-base-100 rounded-lg p-6 w-full max-w-md shadow-xl">
      <h2 className="text-xl sm:text-2xl font-bold mb-8 text-center">{getTitle()}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">😵‍💫</span>
            <div className="rating rating-md">
              {[1, 2, 3, 4, 5].map((level) => (
                <input
                  key={level}
                  type="radio"
                  name="focus-level"
                  className="mask mask-star-2 bg-warning"
                  checked={focusLevel === level}
                  onChange={() => setFocusLevel(level)}
                />
              ))}
            </div>
            <span className="text-2xl">🤩</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-center gap-2">
            <label className="label">
              <span className="label-text">Energy</span>
            </label>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🪫</span>
            <div className="rating rating-md">
              {[1, 2, 3, 4, 5].map((level) => (
                <input
                  key={level}
                  type="radio"
                  name="energy-level"
                  className="mask mask-star-2 bg-info"
                  checked={energyLevel === level}
                  onChange={() => setEnergyLevel(level)}
                />
              ))}
            </div>
            <span className="text-2xl">⚡</span>
          </div>
        </div>

        {!currentEntry && flowState !== 'end' && (
          <div>
            <label className="label">
              <span className="label-text">Tag</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Add a tag..."
            />
          </div>
        )}

        {!currentEntry && (
          <div>
            <div className="flex items-center justify-center gap-2 mt-8">
              <label className="label">
                <span className="label-text">Comment</span>
              </label>
            </div>
            <textarea
              className="textarea textarea-bordered w-full"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 mt-8">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
} 