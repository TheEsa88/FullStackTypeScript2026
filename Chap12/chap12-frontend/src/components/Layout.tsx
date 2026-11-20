// src/components/Layout.tsx
import { Outlet } from 'react-router'
import { Navigation } from './Navigation'
import { ErrorBoundary } from './ErrorBoundary'

export function Layout() {
  return (
    <>
      <Navigation />
      <main>
        {/* "Wrap route-level components with this boundary so that one failing page
            does not crash the entire application." */}
        <ErrorBoundary fallback={<p className="error">This page failed to load.</p>}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </>
  )
}
