import { useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '@/providers/AuthProvider'
import { forgotPassword } from '@/api/auth'
import { useTheme } from '@/providers/ThemeProvider'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

const DENSITY_KEY = 'jt-density'
type Density = 'compact' | 'default' | 'comfortable'

export default function SettingsPage() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [density, setDensityState] = useState<Density>(
    () => (localStorage.getItem(DENSITY_KEY) as Density | null) ?? 'default'
  )
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const setDensity = (d: Density) => {
    localStorage.setItem(DENSITY_KEY, d)
    setDensityState(d)
  }

  const initials = (user?.name || user?.email || 'U').charAt(0).toUpperCase()

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-display font-semibold text-text-primary">Settings</h1>
        <p className="text-text-secondary text-sm mt-0.5">Manage your account and preferences.</p>
      </div>

      {/* Account */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-text-muted">Account</h2>
        <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-bg-surface">
          <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center text-2xl font-semibold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-text-primary">{user?.name || 'User'}</p>
            <p className="text-sm text-text-muted">{user?.email || ''}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <Label>Name</Label>
            <Input defaultValue={user?.name ?? ''} readOnly className="bg-bg-subtle" />
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input defaultValue={user?.email ?? ''} disabled className="bg-bg-subtle" />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => toast.info('Profile updates require a backend update')}
          >
            Save Changes
          </Button>
          <Button
            variant="ghost"
            disabled={resetLoading}
            onClick={async () => {
              setResetLoading(true)
              try {
                await forgotPassword(user!.email)
                toast.success('Password reset email sent. Check your inbox.')
              } catch {
                toast.error('Failed to send reset email. Please try again.')
              } finally {
                setResetLoading(false)
              }
            }}
          >
            {resetLoading ? 'Sending…' : 'Change Password'}
          </Button>
        </div>
      </section>

      <Separator />

      {/* Appearance */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-text-muted">Appearance</h2>
        <div className="space-y-2">
          <Label>Theme</Label>
          <div className="flex gap-3">
            {(['light', 'dark', 'system'] as const).map(t => (
              <div
                key={t}
                onClick={() => setTheme(t)}
                className={cn(
                  'border-2 rounded-lg p-3 cursor-pointer flex-1 transition-colors',
                  theme === t ? 'border-accent' : 'border-border hover:border-border/80',
                )}
              >
                <div className={cn(
                  'rounded h-8 mb-2',
                  t === 'light' ? 'bg-white border border-gray-200' : t === 'dark' ? 'bg-zinc-900' : 'bg-gradient-to-r from-white to-zinc-900',
                )} />
                <p className="text-xs font-medium capitalize text-text-secondary">{t}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Density</Label>
          <ToggleGroup
            type="single"
            value={density}
            onValueChange={v => v && setDensity(v as Density)}
            className="justify-start"
          >
            <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
            <ToggleGroupItem value="default">Default</ToggleGroupItem>
            <ToggleGroupItem value="comfortable">Comfortable</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </section>

      <Separator />

      {/* Data & Privacy */}
      <section className="space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-text-muted">Data & Privacy</h2>
        <p className="text-sm text-text-secondary">
          Your applications and notes are private to your account. They are not shared with employers or used for any other purpose.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info('Export requires a backend update')}>
            Export Data
          </Button>
          <Button variant="ghost" onClick={logout}>
            Sign Out
          </Button>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            Delete Account
          </Button>
        </div>
      </section>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Account"
        description="This will permanently delete your account and all data. This action cannot be undone."
        onConfirm={() => { setDeleteOpen(false); toast.info('Account deletion requires a backend update') }}
      />
    </div>
  )
}
