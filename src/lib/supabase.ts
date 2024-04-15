import { createClient } from "@supabase/supabase-js";
import type { Database } from "./db.types"
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const getClient = () => createClient<Database>(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})
