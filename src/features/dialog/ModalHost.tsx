'use client';
import { useModalStore } from '@/features/dialog/modalStore';
import MenuModal from '@/features/menu/MenuModal';
import PulseModal from '@/features/pulse/PulseModal';
import FlowModal from '@/features/flow/FlowModal';
import FlowEditModal from '@/features/flow/FlowEditModal';
import ConfirmDialog from '@/features/dialog/ConfirmDialog';
import { ComponentType } from 'react';

const modalRegistry: Record<string, ComponentType<any>> = {
  menu: MenuModal,
  pulse: PulseModal,
  flow: FlowModal,
  'flow-edit': FlowEditModal,
  confirm: ConfirmDialog,
};

export default function ModalHost() {
  const { type, props, closeModal } = useModalStore();
  if (!type || !props) return null;

  const Component = modalRegistry[type];
  if (!Component) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-info-content/50 flex items-center justify-center"
      onClick={closeModal}
    >
      <Component {...props} onClose={closeModal} />
    </div>
  );
}
