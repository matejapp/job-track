import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="p-4 rounded-full bg-bg-subtle mb-4">
        <Icon className="h-8 w-8 text-text-muted" />
      </div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="text-sm text-text-secondary mt-1 max-w-xs">{description}</p>
      {action && (
        <Button className="mt-4" onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  )
}
