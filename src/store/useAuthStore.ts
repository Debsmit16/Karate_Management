import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: 'admin' | 'referee' | 'coach') => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Fetch user profile from public.users table
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        if (userData) {
          set({
            user: {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              teamId: userData.team_id || undefined,
            },
            loading: false,
          });
        }
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ user: null, loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) throw userError;

      if (userData) {
        set({
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            teamId: userData.team_id || undefined,
          },
        });
      }
    }
  },

  signUp: async (email: string, password: string, name: string, role: 'admin' | 'referee' | 'coach') => {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      // Create user profile in public.users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name,
          role,
        });

      if (userError) throw userError;

      // Fetch the created user
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (fetchError) throw fetchError;

      if (userData) {
        set({
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            teamId: userData.team_id || undefined,
          },
        });
      }
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ user: null });
  },
}));

// Listen to auth state changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (userData) {
      useAuthStore.getState().user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        teamId: userData.team_id || undefined,
      };
    }
  } else {
    useAuthStore.getState().user = null;
  }
});

