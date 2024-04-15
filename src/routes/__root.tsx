import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import type { AuthContext } from '@/lib/auth.context'
import { Toaster } from "@/components/ui/toaster"

interface RouterContext {
  auth: AuthContext
}

export const Route = createRootRouteWithContext<RouterContext>()({
  loader: async (ctx) => {
    ctx.context
  },
  component: RootComponent
})

function RootComponent() {
  return (
    <>
      <Toaster />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  )
}
