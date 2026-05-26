// Six original logo marks for JobTrack.
// All marks sit on a 24×24 viewBox inside a rounded square container.
// The container is always ink-dark (handled by .brand-mark CSS class);
// fg is hardcoded paper-light so it reads on any dark surface.
// Set BRAND_MARK_VARIANT to switch the active logo across the app.
export const BRAND_MARK_VARIANT = "track";

const INNER_RATIO = 0.62;

function LogoFrame({
  size,
  radius = 0.27,
  children,
  className = "",
  style = {},
}) {
  return (
    <div
      className={`brand-mark ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: size * radius,
        flexShrink: 0,
        ...style,
      }}
    >
      <svg
        width={size * INNER_RATIO}
        height={size * INNER_RATIO}
        viewBox="0 0 24 24"
        style={{ display: "block", overflow: "visible" }}
      >
        {children}
      </svg>
    </div>
  );
}

// 01 · Steps — three rising bars, applied → interview → offer
export function LogoSteps({ size = 28, className, style }) {
  return (
    <LogoFrame size={size} className={className} style={style}>
      <rect x="2" y="14" width="5" height="8" rx="1.2" fill="#f3f1ea" />
      <rect x="9.5" y="9" width="5" height="13" rx="1.2" fill="#f3f1ea" />
      <rect x="17" y="3" width="5" height="19" rx="1.2" fill="var(--accent)" />
    </LogoFrame>
  );
}

// 02 · Track — nodes on a path, journey metaphor
export function LogoTrack({ size = 28, className, style }) {
  return (
    <LogoFrame size={size} className={className} style={style}>
      <path
        d="M3 18 Q 8 18 12 12 T 21 6"
        fill="none"
        stroke="#f3f1ea"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="3" cy="18" r="2.4" fill="#f3f1ea" />
      <circle cx="12" cy="12" r="2.4" fill="#f3f1ea" />
      <circle cx="21" cy="6" r="3.4" fill="var(--accent)" />
    </LogoFrame>
  );
}

// 03 · Notch — folder-tab silhouette with accent corner
export function LogoNotch({ size = 28, className, style }) {
  return (
    <LogoFrame size={size} className={className} style={style}>
      <path d="M3 6 L13 6 L17 2 L21 2 L21 22 L3 22 Z" fill="#f3f1ea" />
      <rect x="14" y="2" width="7" height="6" fill="var(--accent)" />
    </LogoFrame>
  );
}

// 04 · Funnel — pipeline metaphor, applications narrowing to offer
export function LogoFunnel({ size = 28, className, style }) {
  return (
    <LogoFrame size={size} className={className} style={style}>
      <rect x="2" y="3" width="20" height="3.5" rx="1.4" fill="#f3f1ea" />
      <rect x="5" y="9" width="14" height="3.5" rx="1.4" fill="#f3f1ea" />
      <rect x="8" y="15" width="8" height="3.5" rx="1.4" fill="#f3f1ea" />
      <rect x="10" y="20.5" width="4" height="2" rx="1" fill="var(--accent)" />
    </LogoFrame>
  );
}

// 05 · Arc — 75% progress ring with terminal dot, calm and geometric
export function LogoArc({ size = 28, className, style }) {
  return (
    <LogoFrame size={size} className={className} style={style}>
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="#f3f1ea"
        strokeWidth="2"
        opacity="0.22"
      />
      <path
        d="M 12 3 A 9 9 0 1 1 3 12"
        fill="none"
        stroke="#f3f1ea"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="3" cy="12" r="2.8" fill="var(--accent)" />
    </LogoFrame>
  );
}

// 06 · Pin — map pin with accent core, bold and emblem-like
export function LogoPin({ size = 28, className, style }) {
  return (
    <LogoFrame size={size} className={className} style={style}>
      <path
        d="M12 2 C 7 2 3 6 3 11 C 3 16 8 20 12 23 C 16 20 21 16 21 11 C 21 6 17 2 12 2 Z"
        fill="#f3f1ea"
      />
      <circle cx="12" cy="11" r="3.6" fill="var(--accent)" />
    </LogoFrame>
  );
}

const VARIANTS = {
  steps: LogoSteps,
  track: LogoTrack,
  notch: LogoNotch,
  funnel: LogoFunnel,
  arc: LogoArc,
  pin: LogoPin,
};

export default function BrandMark({
  size = 28,
  variant = BRAND_MARK_VARIANT,
  className,
  style,
}) {
  const Mark = VARIANTS[variant] ?? LogoArc;
  return <Mark size={size} className={className} style={style} />;
}
