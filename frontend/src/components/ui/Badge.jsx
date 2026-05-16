import { getStatus } from '../../constants/statuses'

export default function Badge({ status, size = 'md' }) {
  const s  = getStatus(status)
  const sz = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1'
  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full whitespace-nowrap ${sz}`}
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  )
}
