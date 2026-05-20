import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, width = "max-w-lg" }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "rgba(17,17,16,0.55)" }}
        onClick={onClose}
      />
      <div
        className={`relative w-full ${width} animate-slide-up overflow-hidden rounded-2xl border border-ink-rule bg-paper`}
        style={{ boxShadow: "0 32px 80px -20px rgba(17,17,16,0.35)" }}
      >
        <div className="flex items-center justify-between border-b border-ink-rule px-6 py-5">
          <h2 className="font-display text-lg font-bold tracking-tight text-ink">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-paper-soft hover:text-ink"
          >
            <X size={17} />
          </button>
        </div>
        <div className="bg-white px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
