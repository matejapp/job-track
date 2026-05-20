import { Search, Plus } from "lucide-react";

export default function TopBar({ user, onAddClick, searchQuery, onSearch }) {
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <header className="sticky top-0 z-20 flex items-center gap-5 border-b border-ink-rule bg-paper px-8 py-5">
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-[26px] font-bold leading-tight tracking-tight text-ink">
          Welcome{" "}
          <span className="font-serif italic font-normal text-clay">back</span>
          , {firstName}
        </h1>
        <p className="mt-1 text-[12.5px] text-ink-muted">
          Stay organized · Track progress · Land your next role.
        </p>
      </div>

      <div className="relative flex-shrink-0">
        <Search
          size={14}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="text"
          placeholder="Search applications..."
          value={searchQuery ?? ""}
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-56 rounded-full border border-ink-rule bg-white py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20 transition-all"
        />
      </div>

      <button
        onClick={onAddClick}
        className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-all duration-200 hover:bg-clay hover:shadow-[0_14px_30px_-14px_rgba(194,65,12,0.6)] active:scale-[0.98]"
      >
        <Plus size={15} strokeWidth={2.5} />
        Add Application
      </button>
    </header>
  );
}
