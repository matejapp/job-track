import { useState } from "react";
import { Menu, Plus, Search, X } from "lucide-react";

export default function TopBar({
  user,
  onAddClick,
  onMenuClick,
  searchQuery,
  onSearch,
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const firstName = user?.name?.split(" ")[0] ?? "there";

  const closeMobileSearch = () => {
    setMobileSearchOpen(false);
    onSearch?.("");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-ink-rule bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      {/* Default bar */}
      <div className="flex items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6 sm:py-4 lg:px-8 lg:py-5">
        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-ink transition-colors hover:bg-paper-soft lg:hidden"
          aria-label="Open navigation"
        >
          <Menu size={20} strokeWidth={2.2} />
        </button>

        {/* Title */}
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-[17px] font-bold leading-tight tracking-tight text-ink sm:text-[22px] lg:text-[26px]">
            Welcome{" "}
            <span className="font-serif italic font-normal text-clay">
              back
            </span>
            , {firstName}
          </h1>
          <p className="mt-0.5 hidden truncate text-[12.5px] text-ink-muted sm:mt-1 sm:block">
            Stay organized · Track progress · Land your next role.
          </p>
        </div>

        {/* Desktop search */}
        <div className="relative hidden flex-shrink-0 lg:block">
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

        {/* Mobile/tablet search icon */}
        <button
          type="button"
          onClick={() => setMobileSearchOpen(true)}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-paper-soft hover:text-ink lg:hidden"
          aria-label="Search applications"
        >
          <Search size={18} strokeWidth={2.2} />
        </button>

        {/* Add button — icon-only on mobile, full on tablet+ */}
        <button
          onClick={onAddClick}
          className="inline-flex h-10 flex-shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-3 text-sm font-semibold text-paper transition-all duration-200 hover:bg-clay hover:shadow-[0_14px_30px_-14px_rgba(194,65,12,0.6)] active:scale-[0.98] sm:px-4 sm:py-2.5"
          aria-label="Add application"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">Add Application</span>
        </button>
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className="border-t border-ink-rule bg-paper px-4 py-3 lg:hidden">
          <div className="relative flex items-center gap-2">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
            />
            <input
              type="search"
              autoFocus
              placeholder="Search applications..."
              value={searchQuery ?? ""}
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full rounded-full border border-ink-rule bg-white py-2.5 pl-10 pr-10 text-sm text-ink placeholder:text-ink-muted focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20"
            />
            <button
              type="button"
              onClick={closeMobileSearch}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted hover:bg-paper-soft hover:text-ink"
              aria-label="Close search"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
