import { cn } from '@/lib/utils'
import { STATUS_CONFIG } from '@/lib/status'
import type { ApplicationStatus } from '@/types'

interface Props { status: ApplicationStatus; size?: 'sm' | 'md' }

export default function StatusBadge({ status, size = 'md' }: Props) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.Applied
  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium',
      config.bg, config.text,
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
    )}>
      {config.label}
    </span>
  )
}
