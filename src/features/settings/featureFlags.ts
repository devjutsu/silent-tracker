import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FeatureFlags {
  isCaloryTrackerEnabled: boolean;
  setCaloryTrackerEnabled: (enabled: boolean) => void;
}

export const useFeatureFlags = create<FeatureFlags>()(
  persist(
    (set) => ({
      isCaloryTrackerEnabled: true, // enabled by default
      setCaloryTrackerEnabled: (enabled) => set({ isCaloryTrackerEnabled: enabled }),
    }),
    {
      name: 'feature-flags',
    }
  )
); 