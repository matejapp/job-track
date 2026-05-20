export default function StatCard({ title, value, change, icon: Icon, gradient, index }) {
  return (
    <div
      className="rounded-2xl p-5 text-white relative overflow-hidden animate-slide-up"
      style={{ background: gradient, animationDelay: `${index * 60}ms` }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 85% 15%, rgba(255,255,255,0.15) 0%, transparent 55%)' }}
      />
      <div
        className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      />
      <div className="flex items-start justify-between mb-4 relative">
        <p className="text-sm font-medium text-white/75">{title}</p>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.2)' }}
        >
          <Icon size={17} className="text-white" />
        </div>
      </div>
      <p className="font-display text-4xl font-bold text-white mb-1.5 relative">{value}</p>
      {change && (
        <p className="text-[11px] text-white/60 relative">
          <span className="text-white font-bold">↑ {change}</span> from last month
        </p>
      )}
    </div>
  )
}
