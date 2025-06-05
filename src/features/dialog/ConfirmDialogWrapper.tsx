'use client';

import { useConfirmStore } from '@/features/dialog/confirm';
import ConfirmDialog from './ConfirmDialog';

export default function ConfirmDialogWrapper() {
  const { isOpen, message, confirm, cancel } = useConfirmStore();

  return (
    <ConfirmDialog
      isOpen={isOpen}
      message={message}
      onConfirm={confirm}
      onCancel={cancel}
    />
  );
}
