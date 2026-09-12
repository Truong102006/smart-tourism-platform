import { useLayoutEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'

export const AppShell: React.FC = () => {
  const location = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="app-shell">
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  )
}
