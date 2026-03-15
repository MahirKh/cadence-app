import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Goal, GoalInsert, GoalUpdate, GoalCategory } from '@/lib/types';

type GoalState = {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  createGoal: (goal: GoalInsert) => Promise<Goal | null>;
  updateGoal: (id: string, updates: GoalUpdate) => Promise<Goal | null>;
  deleteGoal: (id: string) => Promise<boolean>;
  getGoalsByCategory: (category: GoalCategory) => Goal[];
  getGoalById: (id: string) => Goal | undefined;
};

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  loading: false,
  error: null,

  fetchGoals: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      set({ goals: data ?? [], loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch goals';
      set({ error: message, loading: false });
    }
  },

  createGoal: async (goal: GoalInsert) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('goals')
        .insert({ ...goal, user_id: user.id })
        .select()
        .single();

      if (error) {
        throw error;
      }

      set((state) => ({
        goals: [data, ...state.goals],
        loading: false,
      }));

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create goal';
      set({ error: message, loading: false });
      return null;
    }
  },

  updateGoal: async (id: string, updates: GoalUpdate) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      set((state) => ({
        goals: state.goals.map((g) => (g.id === id ? data : g)),
        loading: false,
      }));

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update goal';
      set({ error: message, loading: false });
      return null;
    }
  },

  deleteGoal: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.from('goals').delete().eq('id', id);

      if (error) {
        throw error;
      }

      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
        loading: false,
      }));

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete goal';
      set({ error: message, loading: false });
      return false;
    }
  },

  getGoalsByCategory: (category: GoalCategory) => {
    return get().goals.filter((g) => g.category === category);
  },

  getGoalById: (id: string) => {
    return get().goals.find((g) => g.id === id);
  },
}));
