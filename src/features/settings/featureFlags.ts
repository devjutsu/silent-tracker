import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FeatureFlags {
  isKeepFitEnabled: boolean;
  setKeepFitEnabled: (enabled: boolean) => void;
}

export const useFeatureFlags = create<FeatureFlags>()(
  persist(
    (set) => ({
      isKeepFitEnabled: true, // enabled by default
      setKeepFitEnabled: (enabled) => set({ isKeepFitEnabled: enabled }),
    }),
    {
      name: 'feature-flags',
    }
  )
); 