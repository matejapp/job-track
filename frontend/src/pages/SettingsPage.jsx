import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import AppShell from "../components/layout/AppShell";

const ACCENTS = [
  { label: "Lime",      value: "#c8ff2e", ink: "#0c0c0d" },
  { label: "Tangerine", value: "#FF7A45", ink: "#0c0c0d" },
  { label: "Azure",     value: "#3D7EFF", ink: "#ffffff" },
  { label: "Violet",    value: "#B084FF", ink: "#ffffff" },
  { label: "Sun",       value: "#FFD43D", ink: "#0c0c0d" },
];

const DENSITY_OPTIONS = [
  { value: "compact",     label: "Compact" },
  { value: "default",     label: "Default" },
  { value: "comfortable", label: "Comfortable" },
];

const DENSITY_ROW_H = { compact: "44px", default: "56px", comfortable: "64px" };

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("jt-theme", theme);
}

function applyAccent(hex, ink) {
  document.documentElement.style.setProperty("--accent", hex);
  document.documentElement.style.setProperty("--accent-ink", ink);
  localStorage.setItem("jt-accent", JSON.stringify({ hex, ink }));
}

function applyDensity(density) {
  document.documentElement.style.setProperty("--row-h", DENSITY_ROW_H[density]);
  localStorage.setItem("jt-density", density);
}

export default function SettingsPage() {
  const { user } = useAuth();

  const [theme,   setTheme]   = useState(() => localStorage.getItem("jt-theme") || "dark");
  const [accent,  setAccent]  = useState(() => {
    try { return JSON.parse(localStorage.getItem("jt-accent")) || ACCENTS[0]; }
    catch { return ACCENTS[0]; }
  });
  const [density, setDensity] = useState(() => localStorage.getItem("jt-density") || "default");

  const handleTheme = (t) => { setTheme(t); applyTheme(t); };
  const handleAccent = (a) => { setAccent(a); applyAccent(a.value, a.ink); };
  const handleDensity = (d) => { setDensity(d); applyDensity(d); };

  return (
    <AppShell>
      <div className="page-head">
        <p className="page-eyebrow">— Settings</p>
        <h1 className="page-title">Preferences</h1>
        <p className="page-sub">Personalise your workspace.</p>
      </div>

      <div className="settings-grid">
        {/* Account */}
        <section className="settings-section">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Account</p>
          <div className="settings-row">
            <div>
              <div className="settings-label">{user?.name || "User"}</div>
              <div className="settings-desc">{user?.email || ""}</div>
            </div>
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-bold text-accent-ink">
              {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="settings-section">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Appearance</p>

          <div className="settings-row">
            <div>
              <div className="settings-label">Theme</div>
              <div className="settings-desc">Light or dark workspace.</div>
            </div>
            <div className="toggle-group">
              <button
                className={`toggle-btn${theme === "light" ? " is-active" : ""}`}
                onClick={() => handleTheme("light")}
              >
                Light
              </button>
              <button
                className={`toggle-btn${theme === "dark" ? " is-active" : ""}`}
                onClick={() => handleTheme("dark")}
              >
                Dark
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-label">Accent colour</div>
              <div className="settings-desc">Used on buttons, highlights, and active states.</div>
            </div>
            <div className="flex items-center gap-2">
              {ACCENTS.map((a) => (
                <button
                  key={a.value}
                  className={`accent-swatch${accent?.value === a.value ? " is-active" : ""}`}
                  style={{ background: a.value }}
                  onClick={() => handleAccent(a)}
                  title={a.label}
                  aria-label={`${a.label} accent`}
                />
              ))}
            </div>
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-label">Density</div>
              <div className="settings-desc">Controls row height and spacing in lists.</div>
            </div>
            <div className="toggle-group">
              {DENSITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className={`toggle-btn${density === opt.value ? " is-active" : ""}`}
                  onClick={() => handleDensity(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Data */}
        <section className="settings-section">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Data</p>
          <div className="settings-row">
            <div>
              <div className="settings-label">Privacy</div>
              <div className="settings-desc">
                Your applications and notes are private to your account. They are not shared with employers or used for any other purpose.
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
