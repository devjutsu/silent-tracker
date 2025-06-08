'use client';

import { useState, useEffect } from 'react';
import { useFlowStore, FlowEntry } from '@/features/flow/flow';
import { useNotificationStore } from '@/features/notifications/notifications';
import { useFlowEditModalStore } from './flowEditModalStore';
import toast from 'react-hot-toast';
import { useConfirmStore } from '@/features/dialog/confirm';

interface FlowEditModalProps {
  entry: FlowEntry;
}

export default function FlowEditModal({ entry }: FlowEditModalProps) {
  const { isOpen, closeModal } = useFlowEditModalStore();
  const { deleteEntry, updateEntry } = useFlowStore();
  const { setModalOpen } = useNotificationStore();
  const [title, setTitle] = useState(entry.title || '');
  const [goal, setGoal] = useState(entry.goal || '');
  const confirm = useConfirmStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setModalOpen(true);
      // Reset form when modal opens
      setTitle(entry.title || '');
      setGoal(entry.goal || '');
    } else {
      document.body.style.overflow = 'unset';
      setModalOpen(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
      setModalOpen(false);
    };
  }, [isOpen, setModalOpen, entry]);

  if (!isOpen) return null;

  const handleDelete = async () => {
    const confirmed = await confirm.openConfirm(
      'Delete Flow Entry',
      'Are you sure you want to delete this flow entry? This action cannot be undone.'
    );
    if (!confirmed) return;
    try {
      await deleteEntry(entry.id);
      toast.success('Flow entry deleted successfully');
      closeModal();
    } catch (error) {
      toast.error(`Failed to delete flow entry: ${error}`);
    }
  };

  const handleSave = async () => {
    try {
      await updateEntry(entry.id, {
        title: title.trim() || null,
        goal: goal.trim() || null,
      });
      toast.success('Flow entry updated successfully');
      closeModal();
    } catch (error) {
      toast.error(`Failed to update flow entry: ${error}`);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={closeModal}
    >
      <div
        className="bg-base-100 rounded-lg p-6 w-full max-w-md shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Edit Flow Entry</h2>
        <div className="space-y-4">
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

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between items-center mt-6">
            <button
              type="button"
              className="btn btn-error w-full sm:w-auto"
              onClick={handleDelete}
            >
              Delete Entry
            </button>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                type="button"
                className="btn btn-ghost w-full sm:w-auto"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary w-full sm:w-auto"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 