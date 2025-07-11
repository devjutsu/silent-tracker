import { create } from 'zustand';

type ModalType = 'menu' | 'pulse' | 'flow' | 'flowstart' | 'confirm' | 'flow-edit';

interface BaseModalProps {
  onClose: () => void;
}

interface ConfirmModalProps extends BaseModalProps {
  title: string;
  content: string;
  onConfirm: () => void;
}

interface FlowEditModalProps extends BaseModalProps {
  entry: {
    id: string;
    title?: string | null;
    goal?: string | null;
    start_time: string;
    end_time?: string | null;
    is_active: boolean;
    interrupted: boolean;
  };
}

export type ModalProps = {
  menu: BaseModalProps;
  pulse: BaseModalProps;
  flow: BaseModalProps;
  flowstart: BaseModalProps;
  confirm: ConfirmModalProps;
  'flow-edit': FlowEditModalProps;
};

type ModalState = {
  type: ModalType | null;
  props: ModalProps[ModalType] | null;
  openModal: <T extends ModalType>(type: T, props: Omit<ModalProps[T], 'onClose'>) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  type: null,
  props: null,
  openModal: (type, props) => set({ 
    type, 
    props: {
      ...props,
      onClose: () => set({ type: null, props: null })
    } as ModalProps[ModalType]
  }),
  closeModal: () => set({ type: null, props: null }),
}));