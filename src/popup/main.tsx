import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { DEFAULT_PREFERENCES, readPreferences, writePreferences } from "../core/preferences";
import type { ExtensionPreferences } from "../core/types";
import { Icons } from "../ui/Icon";
import "./popup.css";

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="popup-row">
      <span><strong>{label}</strong><small>{description}</small></span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <i aria-hidden="true" />
    </label>
  );
}

function Popup() {
  const [preferences, setPreferences] = useState<ExtensionPreferences>(DEFAULT_PREFERENCES);
  const [ready, setReady] = useState(false);
  useEffect(() => { void readPreferences(chrome.storage).then((value) => { setPreferences(value); setReady(true); }); }, []);
  const update = (patch: Partial<ExtensionPreferences>) => {
    const next = { ...preferences, ...patch };
    setPreferences(next);
    void writePreferences(next, chrome.storage);
  };
  if (!ready) return null;
  const native = preferences.nativeModeOverride;
  return (
    <main className="popup">
      <header><span>TF</span><div><h1>TubeFlix</h1><p>Your YouTube, reimagined.</p></div></header>
      <section>
        <Toggle label="Cinematic experience" description="Transform supported YouTube pages" checked={preferences.enabled && !native} onChange={(enabled) => update({ enabled, nativeModeOverride: false })} />
        <Toggle label="Hover details" description="Expand a card with details after hovering" checked={preferences.autoplayPreviews} onChange={(autoplayPreviews) => update({ autoplayPreviews })} />
        <Toggle label="Reduced motion" description="Remove scaling and long transitions" checked={preferences.reducedMotion} onChange={(reducedMotion) => update({ reducedMotion })} />
        <Toggle label="Compact rails" description="Show up to six videos per row" checked={preferences.compactDensity} onChange={(compactDensity) => update({ compactDensity })} />
      </section>
      <button className="popup-native" onClick={() => update({ nativeModeOverride: !native })}>
        {native ? <Icons.Check size={18} /> : <Icons.Menu size={18} />}
        {native ? "Use cinematic view" : "Restore native YouTube"}
      </button>
      <footer>Stored locally in Chrome. No analytics or external service.</footer>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><Popup /></React.StrictMode>);
