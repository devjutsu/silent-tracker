import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface TrackingEntry {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  description: string;
  created_at: string;
}

interface TrackingState {
  entries: TrackingEntry[];
  currentEntry: TrackingEntry | null;
  loading: boolean;
  error: string | null;
  setEntries: (entries: TrackingEntry[]) => void;
  setCurrentEntry: (entry: TrackingEntry | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  startTracking: (description: string) => Promise<void>;
  stopTracking: () => Promise<void>;
  fetchEntries: () => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  purgeEntries: () => Promise<void>;
}

export const useTrackingStore = create<TrackingState>((set, get) => ({
  entries: [],
  currentEntry: null,
  loading: false,
  error: null,
  setEntries: (entries) => set({ entries }),
  setCurrentEntry: (entry) => set({ currentEntry: entry }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  startTracking: async (description: string) => {
    try {
      set({ loading: true, error: null });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('tracking_entries')
        .insert([
          {
            user_id: user.id,
            start_time: new Date().toISOString(),
            description,
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

  stopTracking: async () => {
    try {
      set({ loading: true, error: null });
      const { currentEntry } = get();
      if (!currentEntry) throw new Error('No active tracking session');

      const { error } = await supabase
        .from('tracking_entries')
        .update({ end_time: new Date().toISOString() })
        .eq('id', currentEntry.id);

      if (error) throw error;
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

      const { data, error } = await supabase
        .from('tracking_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Find the most recent unfinished entry (where end_time is null)
      const activeEntry = data.find(entry => entry.end_time === null);
      
      set({ 
        entries: data,
        currentEntry: activeEntry || null // Restore the active entry if found
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
        .from('tracking_entries')
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
        .from('tracking_entries')
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
})); 