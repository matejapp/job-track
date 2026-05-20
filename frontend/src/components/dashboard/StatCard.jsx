export default function StatCard({ title, value, icon: Icon, gradient, index }) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 text-white animate-slide-up"
      style={{ background: gradient, animationDelay: `${index * 60}ms` }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 85% 15%, rgba(255,255,255,0.18) 0%, transparent 55%)",
        }}
      />
      <div
        className="pointer-events-none absolute -right-7 -bottom-7 h-32 w-32 rounded-full"
        style={{ background: "rgba(255,255,255,0.08)" }}
      />

      <div className="relative mb-4 flex items-start justify-between">
        <p className="text-[12.5px] font-medium text-white/80">{title}</p>
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <Icon size={17} className="text-white" />
        </div>
      </div>

      <div className="relative flex items-end gap-2">
        <p className="font-display text-[38px] font-bold leading-none tabular-nums text-white">
          {value}
        </p>
        <span className="mb-1 font-serif text-[15px] italic text-white/55">
          / {number}
        </span>
      </div>
    </div>
  );
}
