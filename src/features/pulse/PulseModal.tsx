'use client';

import { useState, useEffect } from 'react';
import { usePulseStore } from '@/features/pulse/pulse';
import { useNotificationStore } from '@/features/notifications/notifications';
import { usePulseModalStore } from './pulseModalStore';
import { useFlowStore } from '@/features/flow/flow';
import toast from 'react-hot-toast';

export default function PulseModal() {
  const { isOpen, closeModal, openModal } = usePulseModalStore();
  const { addRecord } = usePulseStore();
  const { setModalOpen } = useNotificationStore();
  const { currentEntry } = useFlowStore();
  const [focusLevel, setFocusLevel] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [tag, setTag] = useState('');
  const [note, setNote] = useState('');

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

  // Add event listener for showPulseModal event
  useEffect(() => {
    const handleShowPulseModal = () => {
      openModal();
    };

    window.addEventListener('showPulseModal', handleShowPulseModal);
    return () => {
      window.removeEventListener('showPulseModal', handleShowPulseModal);
    };
  }, [openModal]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addRecord(
        focusLevel,
        currentEntry?.activity || 'work',
        energyLevel,
        tag.trim() || undefined,
        note.trim() || undefined,
        currentEntry?.id
      );
      toast.success('Pulse record added successfully');
      closeModal();
    } catch (error) {
      toast.error(`Failed to add pulse record ${error}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">How is your focus?</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Focus Level</span>
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                className={`btn btn-outline flex-1 ${focusLevel === 1 ? 'btn-primary' : ''}`}
                onClick={() => setFocusLevel(1)}
              >
                😵 Distracted
              </button>
              <button
                type="button"
                className={`btn btn-outline flex-1 ${focusLevel === 3 ? 'btn-primary' : ''}`}
                onClick={() => setFocusLevel(3)}
              >
                🙂 OK
              </button>
              <button
                type="button"
                className={`btn btn-outline flex-1 ${focusLevel === 5 ? 'btn-primary' : ''}`}
                onClick={() => setFocusLevel(5)}
              >
                🔥 Great
              </button>
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text">Energy Level (1-5)</span>
            </label>
            <div className="rating rating-md ml-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <input
                  key={level}
                  type="radio"
                  name="energy-level"
                  className="mask mask-star-2 bg-warning"
                  checked={energyLevel === level}
                  onChange={() => setEnergyLevel(level)}
                />
              ))}
            </div>
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

          <div>
            <label className="label">
              <span className="label-text">Note (optional)</span>
            </label>
            <textarea
              placeholder="Any additional thoughts or context..."
              className="textarea textarea-bordered w-full"
              value={note}
              onChange={(e) => setNote(e.target.value)}
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
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 