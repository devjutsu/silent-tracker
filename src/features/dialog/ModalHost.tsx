'use client';
import { useModalStore } from '@/features/dialog/modalStore';
import MenuModal from '@/features/menu/MenuModal';
import PulseModal from '@/features/pulse/PulseModal';
import FlowModal from '@/features/flow/FlowModal';
import ConfirmDialog from '@/features/dialog/ConfirmDialog';
import { ComponentType } from 'react';

const modalRegistry: Record<string, ComponentType<any>> = {
  menu: MenuModal,
  pulse: PulseModal,
  flow: FlowModal,
  confirm: ConfirmDialog,
};

export default function ModalHost() {
  const { type, props, closeModal } = useModalStore();
  if (!type || !props) return null;

  const Component = modalRegistry[type];
  if (!Component) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <Component {...props} onClose={closeModal} />
    </div>
  );
}
