import { Session, SupabaseClient } from '@supabase/supabase-js'
import * as React from 'react'
import type { Database } from "./db.types"

export interface AuthContext {
  isAuthenticated: boolean
  role?: string
  setSession: (session: Session | null) => void
  session: Session | null
  supabase: SupabaseClient<Database>
}
export const AuthContext = React.createContext<AuthContext | null>(null)

