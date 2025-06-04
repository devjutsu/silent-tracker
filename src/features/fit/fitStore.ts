import { create } from 'zustand';

export type FitActivity = {
  id: number;
  type: string;
  duration: number; // minutes
  timestamp: string;
};

type FitState = {
  activities: FitActivity[];
  totalMinutes: number;
  addActivity: (a: FitActivity) => void;
};

export const useFitStore = create<FitState>((set) => ({
  activities: [],
  totalMinutes: 0,
  addActivity: (activity) =>
    set((state) => ({
      activities: [...state.activities, activity],
      totalMinutes: state.totalMinutes + activity.duration,
    })),
}));
