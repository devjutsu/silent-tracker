'use client';

import { useConfirmStore } from '@/features/dialog/confirm';
import ConfirmDialog from './ConfirmDialog';

export default function ConfirmDialogWrapper() {
  const { isOpen, title, content, confirm, cancel } = useConfirmStore();

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title={title}
      content={content}
      onConfirm={confirm}
      onCancel={cancel}
    />
  );
}
