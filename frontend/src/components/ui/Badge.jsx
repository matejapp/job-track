import { getStage } from '../../constants/statuses'

export default function Badge({ status, size = 'md' }) {
  const meta = getStage(status)
  const sz = size === 'sm' ? { fontSize: 10, padding: '2px 8px' } : { fontSize: 12, padding: '3px 10px' }
  return (
    <span
      className={`pill ${meta.cssClass}`}
      style={sz}
      aria-label={meta.label}
    >
      <span className="pdot" />
      {meta.label}
    </span>
  )
}
