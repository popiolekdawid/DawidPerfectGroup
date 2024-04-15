import { useAuth } from '@/lib/useAuth'
import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

type AuthSearch = {
  returnTo?: string
}
let returnTo: string | undefined

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
  validateSearch: (params: Record<string, unknown>): AuthSearch => {
    return {
      returnTo: typeof params.returnTo === 'string' ? params.returnTo : undefined
    }
  },
  beforeLoad: ({ context, search }) => {
    returnTo = search.returnTo
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: search?.returnTo ? decodeURIComponent(search.returnTo) : '/albums',
      })
    }
  },
})

function AuthLayout() {
  const auth = useAuth()
  const goto = useNavigate()
  useEffect(() => {
    const { data } = auth.supabase.auth.onAuthStateChange((_evt, session) => {
      if (session) {
        goto({
          to: returnTo ? returnTo : '/albums',
        })
      }
    })
    return () => {
      data.subscription.unsubscribe
    }
  }, [goto, auth])
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]" >
      <div className="flex items-center justify-center py-12">
        <Outlet />
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/photo_login.jpg"
          alt="Image"
          className="h-screen w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div >
  )
}
