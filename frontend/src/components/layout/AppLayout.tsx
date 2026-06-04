import { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout() {
  const { token } = useAuth()
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('jt-sidebar-collapsed') === 'true'
  )
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('jt-sidebar-collapsed', String(collapsed))
  }, [collapsed])

  if (!token) return <Navigate to="/login" replace />

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Topbar onMenuClick={() => setMobileOpen(o => !o)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
