import { create } from 'zustand';
import { persist } from "zustand/middleware"
import type { Database } from './db.types';
import type { Session, SupabaseClient } from '@supabase/supabase-js';

interface GlobalStore {
  auth: {
    session: Session | null;
    supabase: SupabaseClient<Database> | null;
    role: string | null;
  },
  setRole: (role: string | null) => void
  setSession: (session: Session | null) => void
  albumPhotos: Record<string, { path: string }[] | undefined>
  albumCache: Record<string, {
    signedUrl: string;
    path: string;
  }[] | undefined>
}

export const globalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      auth: {
        session: null,
        supabase: null,
        role: null
      },
      albumPhotos: {},
      albumCache: {},
      setRole: function(role: string | null) {
        set((state) => {
          state.auth.role = role
          return state
        })
      },
      setSession(session) {
        set((state) => {
          state.auth.session = session
          return state
        })
      }
    }), { name: 'global-store' }))
