import { StrictMode } from 'react'
import "./assets/index.css"
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { AuthProvider } from './lib/auth.provider'
import { useAuth } from './lib/useAuth'
import NotFoundPage from './components/NotFoundPage'
import ErrorComponent from './components/ErrorComponents'

// Create a new router instance
const router = createRouter({
  routeTree, context: {
    auth: undefined!,
  },
  defaultNotFoundComponent: NotFoundPage,
  defaultErrorComponent: ErrorComponent
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

// Render the app
const rootElement = document.getElementById('app')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </StrictMode>,
  )
}
