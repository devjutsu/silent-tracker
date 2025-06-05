import { create } from 'zustand';

interface PulseModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const usePulseModalStore = create<PulseModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
})); 