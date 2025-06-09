import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { useNotificationStore } from '@/features/notifications/notifications';

// Utility functions for timezone conversion
const toLocalTime = (utcDate: string | Date): Date => {
  const date = new Date(utcDate);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};

const toUTCTime = (localDate: Date): string => {
  return new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000).toISOString();
};

export interface FlowEntry {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  goal: string | null;
  created_at: string;
  title: string | null;
  is_active: boolean;
  interrupted: boolean;
}

interface FlowState {
  entries: FlowEntry[];
  currentEntry: FlowEntry | null;
  loading: boolean;
  error: string | null;
  setEntries: (entries: FlowEntry[]) => void;
  setCurrentEntry: (entry: FlowEntry | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  startFlow: (goal?: string, title?: string) => Promise<void>;
  stopFlow: () => Promise<void>;
  updateEntry: (id: string, updates: Partial<FlowEntry>) => Promise<void>;
  fetchEntries: () => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  purgeEntries: () => Promise<void>;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  entries: [],
  currentEntry: null,
  loading: false,
  error: null,
  setEntries: (entries) => set({ entries }),
  setCurrentEntry: (entry) => set({ currentEntry: entry }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  startFlow: async (goal?: string, title?: string) => {
    try {
      set({ loading: true, error: null });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('flow')
        .insert([
          {
            user_id: user.id,
            start_time: new Date().toISOString(),
            goal: goal || null,
            title: title || null,
            is_active: true,
            interrupted: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      set({ currentEntry: data });
      await get().fetchEntries();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ loading: false });
    }
  },

  stopFlow: async () => {
    try {
      set({ loading: true, error: null });
      const { currentEntry } = get();
      if (!currentEntry) throw new Error('No active focus flow session');

      const { error } = await supabase
        .from('flow')
        .update({ 
          end_time: new Date().toISOString(),
          is_active: false,
          interrupted: false,
        })
        .eq('id', currentEntry.id);

      if (error) throw error;
      
      // Stop notifications when Flow is stopped
      useNotificationStore.getState().stopNotifications();
      
      set({ currentEntry: null });
      await get().fetchEntries();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ loading: false });
    }
  },

  fetchEntries: async () => {
    try {
      set({ loading: true, error: null });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get today's start and end timestamps
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { data, error } = await supabase
        .from('flow')
        .select('*')
        .eq('user_id', user.id)
        .gte('start_time', today.toISOString())
        .lt('start_time', tomorrow.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Convert UTC timestamps to local time
      const localData = data.map(entry => ({
        ...entry,
        start_time: toLocalTime(entry.start_time).toISOString(),
        end_time: entry.end_time ? toLocalTime(entry.end_time).toISOString() : null,
      }));
      
      // Find the active entry
      const activeEntry = localData.find(entry => entry.is_active);
      
      set({ 
        entries: localData,
        currentEntry: activeEntry || null
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ loading: false });
    }
  },

  deleteEntry: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('flow')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchEntries();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ loading: false });
    }
  },

  purgeEntries: async () => {
    try {
      set({ loading: true, error: null });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('flow')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      set({ entries: [], currentEntry: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ loading: false });
    }
  },

  updateEntry: async (id: string, updates: Partial<FlowEntry>) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('flow')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await get().fetchEntries();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ loading: false });
    }
  },
})); 