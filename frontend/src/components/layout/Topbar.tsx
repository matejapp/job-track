import { Menu, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/providers/ThemeProvider'
import { Button } from '@/components/ui/button'
import { useLocation } from 'react-router-dom'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/applications': 'Applications',
  '/calendar': 'Calendar',
  '/statistics': 'Statistics',
  '/recruiters': 'Recruiters',
  '/documents': 'Documents',
  '/settings': 'Settings',
}

interface Props {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: Props) {
  const { theme, setTheme } = useTheme()
  const { pathname } = useLocation()
  const key = Object.keys(PAGE_TITLES).find(p => pathname.startsWith(p))
  const title = key ? PAGE_TITLES[key] : 'JobTrack'

  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 bg-bg-surface border-b border-border flex-shrink-0">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-base font-semibold text-text-primary">{title}</h1>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </header>
  )
}
