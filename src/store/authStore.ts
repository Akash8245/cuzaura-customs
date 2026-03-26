import { create } from "zustand";
import { supabase, User } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

interface AuthStore {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  setUser: (user: User | null) => set({ user }),
  setSession: (session: Session | null) => set({ session }),

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      if (data.user && data.session) {
        set({
          user: data.user,
          session: data.session,
          isLoading: false,
          error: null,
        });
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false, user: null, session: null });
      throw err;
    }
  },

  signup: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            email: email,
          },
        },
      });
      
      if (error) throw error;

      // Create user profile in database
      if (data.user) {
        const { error: profileError } = await supabase
          .from("users")
          .upsert({
            id: data.user.id,
            email: email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Don't throw - user is created even if profile fails
        }
      }

      set({
        user: data.user || null,
        session: data.session || null,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false, user: null, session: null });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null, isLoading: false, error: null });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      const session = data.session;
      set({
        user: session?.user || null,
        session: session || null,
        isLoading: false,
        error: null,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false, user: null, session: null });
    }
  },

  initializeAuth: async () => {
    try {
      // First check existing session
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      const session = data.session;
      set({
        user: session?.user || null,
        session: session || null,
        isLoading: false,
        isInitialized: true,
        error: null,
      });

      // Set up listener for auth state changes
      supabase.auth.onAuthStateChange((event, session) => {
        set({
          user: session?.user || null,
          session: session || null,
          error: null,
        });
      });
    } catch (err: any) {
      set({
        error: err.message,
        user: null,
        session: null,
        isLoading: false,
        isInitialized: true,
      });
    }
  },
}));
