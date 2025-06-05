import { create } from 'zustand';

interface ConfirmDialogStore {
  isOpen: boolean;
  message: string;
  resolve: ((confirmed: boolean) => void) | null;
  openConfirm: (message: string) => Promise<boolean>;
  confirm: () => void;
  cancel: () => void;
}

export const useConfirmStore = create<ConfirmDialogStore>((set, get) => ({
  isOpen: false,
  message: '',
  resolve: null,
  openConfirm: (message) =>
    new Promise((resolve) => {
      set({ isOpen: true, message, resolve });
    }),
  confirm: () => {
    const { resolve } = get();
    resolve?.(true);
    set({ isOpen: false, resolve: null });
  },
  cancel: () => {
    const { resolve } = get();
    resolve?.(false);
    set({ isOpen: false, resolve: null });
  },
}));
