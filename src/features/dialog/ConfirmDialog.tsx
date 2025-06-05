'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface ConfirmDialogProps {
  message: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  message,
  isOpen,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onCancel}
    >
      <div
        className="bg-base-100 rounded-box shadow-xl w-full max-w-sm p-6 space-y-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <p className="text-base-content">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="btn btn-sm btn-ghost"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm btn-error"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
