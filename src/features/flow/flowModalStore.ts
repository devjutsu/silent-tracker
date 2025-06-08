import { create } from 'zustand';

interface FlowModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useFlowModalStore = create<FlowModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
})); 