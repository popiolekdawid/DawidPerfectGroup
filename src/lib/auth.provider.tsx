import { Session } from "@supabase/supabase-js"
import { AuthContext } from "@/lib/auth.context"
import React, { useEffect } from "react"
import { getClient } from "./supabase"

const supabase = getClient()
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null)
  const [role, setRole] = React.useState<string>()
  const isAuthenticated = !!session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      supabase.from("profiles").select("role").single().then((response) => { response.data ? setRole(response.data.role) : null })
    })

    return () => subscription.unsubscribe()
  }, [])
  return (
    <AuthContext.Provider value={{ isAuthenticated, supabase, session, setSession, role }}>
      {children}
    </AuthContext.Provider>
  )
}
