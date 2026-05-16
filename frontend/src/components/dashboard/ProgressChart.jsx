import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2 text-xs shadow-xl pointer-events-none"
      style={{ background: '#0f0f23', color: '#fff' }}>
      <p className="font-semibold mb-0.5">{label}</p>
      <p style={{ color: '#a78bfa' }}>{payload[0].value} Applications</p>
    </div>
  )
}

function buildChartData(applications) {
  if (!applications.length) return []
  const sorted = [...applications].sort((a, b) => new Date(a.dateApplied) - new Date(b.dateApplied))
  const byWeek = {}
  sorted.forEach((app) => {
    const d = new Date(app.dateApplied)
    const mon = new Date(d)
    mon.setDate(d.getDate() - ((d.getDay() + 6) % 7))
    const key = mon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    byWeek[key] = (byWeek[key] ?? 0) + 1
  })
  let cumulative = 0
  return Object.entries(byWeek).map(([label, count]) => {
    cumulative += count
    return { label, count: cumulative }
  })
}

export default function ProgressChart({ applications }) {
  const data = buildChartData(applications)
  return (
    <div className="card p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display font-bold text-slate-900 text-base">Application Progress</h2>
        <span className="text-[11px] text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg font-medium">
          All Time
        </span>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height={190}>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -22 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0eefa" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone" dataKey="count"
              stroke="#7c3aed" strokeWidth={2.5} fill="url(#areaGrad)"
              dot={{ r: 3.5, fill: '#7c3aed', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 5, fill: '#7c3aed', stroke: '#fff', strokeWidth: 2.5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
