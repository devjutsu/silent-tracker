'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

interface ConfirmDialogProps {
  title: string;
  content: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  title,
  content,
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-accent-content/30"
      onClick={onCancel}
    >
      <div className="flex items-center justify-center p-0 bg-accent-content/10 rounded-xl shadow-2xl">
        <div
          className="bg-base-100 rounded-box shadow-xl w-full max-w-sm p-6 space-y-4 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <h3 className="text-lg font-semibold text-base-content">{title}</h3>
          <p className="text-base-content">{content}</p>
          <div className="flex justify-end gap-3">
            <button className="btn btn-sm hover:text-accent-content hover:bg-accent" onClick={onCancel}>
              Cancel
            </button>
            <button className="btn btn-sm btn-neutral" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
