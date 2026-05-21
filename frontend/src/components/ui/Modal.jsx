import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, width = "max-w-lg" }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "rgba(17,17,16,0.55)" }}
        onClick={onClose}
      />
      <div
        className={`relative w-full ${width} animate-slide-up overflow-hidden rounded-t-2xl border border-ink-rule bg-paper sm:rounded-2xl`}
        style={{
          boxShadow: "0 32px 80px -20px rgba(17,17,16,0.35)",
          maxHeight: "92dvh",
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Drag handle (mobile only) */}
        <div className="flex justify-center pt-2 sm:hidden">
          <span className="h-1 w-10 rounded-full bg-ink-rule" />
        </div>

        <div className="flex items-center justify-between border-b border-ink-rule px-5 py-4 sm:px-6 sm:py-5">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-paper-soft hover:text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div
          className="overflow-y-auto bg-white px-5 py-5 sm:px-6"
          style={{ maxHeight: "calc(92dvh - 64px)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
