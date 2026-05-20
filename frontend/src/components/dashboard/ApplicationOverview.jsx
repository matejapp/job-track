import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { STATUSES } from '../../constants/statuses'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-white shadow-xl rounded-xl px-3 py-2 border border-slate-100 text-xs pointer-events-none">
      <p className="font-bold text-slate-800">{d.name}</p>
      <p className="text-slate-500">{d.value} apps · {d.payload.pct}%</p>
    </div>
  )
}

export default function ApplicationOverview({ applications }) {
  const total = applications.length

  const data = STATUSES.map((s) => {
    const count = applications.filter((a) => a.status === s.value).length
    return {
      name: s.label,
      value: count,
      color: s.color,
      pct: total > 0 ? ((count / total) * 100).toFixed(1) : '0.0',
    }
  }).filter((d) => d.value > 0)

  return (
    <div className="card p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display font-bold text-slate-900 text-base">Application Overview</h2>
        <span className="text-[11px] text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-medium">
          All Time
        </span>
      </div>

      <div className="flex items-center gap-6 flex-1">
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={176} height={176}>
            <PieChart>
              <Pie
                data={data.length ? data : [{ name: 'None', value: 1, color: '#e2e8f0' }]}
                cx={84} cy={84}
                innerRadius={52} outerRadius={82}
                dataKey="value" strokeWidth={0} paddingAngle={data.length > 1 ? 2 : 0}
              >
                {(data.length ? data : [{ color: '#e2e8f0' }]).map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-display text-3xl font-bold text-slate-900">{total}</span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">Total</span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          {STATUSES.map((s) => {
            const count = applications.filter((a) => a.status === s.value).length
            const pct = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0'
            return (
              <div key={s.value} className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <span className="text-slate-500 flex-1">{s.label}</span>
                <span className="font-bold text-slate-800 tabular-nums">{count}</span>
                <span className="text-slate-400 w-11 text-right tabular-nums">({pct}%)</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
