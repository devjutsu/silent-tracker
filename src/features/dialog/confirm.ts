import { create } from 'zustand';

interface ConfirmDialogStore {
  isOpen: boolean;
  title: string;
  content: string;
  resolve: ((confirmed: boolean) => void) | null;
  openConfirm: (title: string, content: string) => Promise<boolean>;
  confirm: () => void;
  cancel: () => void;
}

export const useConfirmStore = create<ConfirmDialogStore>((set, get) => ({
  isOpen: false,
  title: '',
  content: '',
  resolve: null,
  openConfirm: (title, content) =>
    new Promise((resolve) => {
      set({ isOpen: true, title, content, resolve });
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
