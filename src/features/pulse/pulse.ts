import { create } from 'zustand';
import { supabase } from '@/lib/supabase';


export interface PulseRecord {
  id: string;
  user_id: string;
  created_at: string;
  focus_level: number;
  activity: string;
  tag: string | null;
}

interface PulseState {
  records: PulseRecord[];
  loading: boolean;
  error: string | null;
  setRecords: (records: PulseRecord[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addRecord: (focusLevel: number, activity: string, tag?: string) => Promise<void>;
  fetchRecords: () => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
  purgeRecords: () => Promise<void>;
}

export const usePulseStore = create<PulseState>((set, get) => ({
  records: [],
  loading: false,
  error: null,
  setRecords: (records) => set({ records }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addRecord: async (focusLevel: number, activity: string, tag?: string) => {
    try {
      set({ loading: true, error: null });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('pulse')
        .insert([
          {
            user_id: user.id,
            focus_level: focusLevel,
            activity,
            tag,
          },
        ]);

      if (error) throw error;
      await get().fetchRecords();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ loading: false });
    }
  },

  fetchRecords: async () => {
    try {
      set({ loading: true, error: null });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('pulse')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ records: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ loading: false });
    }
  },

  deleteRecord: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('pulse')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await get().fetchRecords();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ loading: false });
    }
  },

  purgeRecords: async () => {
    try {
      set({ loading: true, error: null });
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('pulse')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      set({ records: [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    } finally {
      set({ loading: false });
    }
  },
})); 