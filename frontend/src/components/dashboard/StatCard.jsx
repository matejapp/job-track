export default function StatCard({ title, value, icon: Icon, gradient, index }) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-4 text-white animate-slide-up sm:p-5"
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

      <div className="relative mb-3 flex items-start justify-between sm:mb-4">
        <p className="pr-2 text-[11.5px] font-medium leading-tight text-white/85 sm:text-[12.5px]">
          {title}
        </p>
        <div
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl sm:h-9 sm:w-9"
          style={{ background: "rgba(255,255,255,0.2)" }}
        >
          <Icon size={15} className="text-white sm:size-[17px]" />
        </div>
      </div>

      <div className="relative flex items-end gap-2">
        <p className="font-display text-[30px] font-bold leading-none tabular-nums text-white sm:text-[34px] lg:text-[38px]">
          {value}
        </p>
        <span className="mb-1 font-serif text-[13px] italic text-white/55 sm:text-[15px]">
          / {number}
        </span>
      </div>
    </div>
  );
}
