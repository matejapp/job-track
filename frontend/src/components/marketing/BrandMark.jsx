export default function BrandMark({ theme = "dark", size = "default" }) {
  const isLight = theme === "light";
  const isCompact = size === "compact";

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-md ${
          isCompact ? "h-7 w-7" : "h-9 w-9"
        } ${isLight ? "bg-paper text-ink" : "bg-ink text-paper"}`}
        aria-hidden="true"
      >
        <span
          className={`font-serif italic font-bold leading-none ${
            isCompact ? "text-base" : "text-xl"
          } translate-y-[1px]`}
        >
          J
        </span>
        <span className="absolute right-[5px] top-[5px] h-[5px] w-[5px] rounded-full bg-clay" />
      </div>
      <span
        className={`font-display font-bold tracking-tight ${
          isCompact ? "text-base" : "text-lg"
        } ${isLight ? "text-paper" : "text-ink"}`}
      >
        JobTrack
      </span>
    </div>
  );
}
