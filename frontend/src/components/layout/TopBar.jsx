import { Search, Plus } from "lucide-react";

export default function TopBar({ user, onAddClick, searchQuery, onSearch }) {
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center gap-5 sticky top-0 z-20">
      <div className="flex-1 min-w-0">
        <h1 className="font-display text-2xl font-bold text-slate-900 leading-tight">
          Welcome back, {firstName}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Stay organized. Track progress. Land your next role.
        </p>
      </div>

      <div className="relative flex-shrink-0">
        <Search
          size={14}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search applications..."
          value={searchQuery ?? ""}
          onChange={(e) => onSearch?.(e.target.value)}
          className="pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none
                     focus:ring-2 focus:ring-violet-500/25 focus:border-violet-400 w-52 transition-all
                     placeholder:text-slate-400 bg-slate-50 focus:bg-white"
        />
      </div>

      <button onClick={onAddClick} className="btn-primary flex-shrink-0">
        <Plus size={15} />
        Add Application
      </button>
    </header>
  );
}
