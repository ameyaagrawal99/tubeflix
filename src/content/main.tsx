import React from "react";
import { createRoot, type Root } from "react-dom/client";
import { YouTubePageAdapter } from "../adapters/youtube";
import { detectRoute, observeYouTubeRoute } from "../core/routes";
import { readPreferences, subscribeToPreferences } from "../core/preferences";
import type { ExtensionPreferences, PageModel } from "../core/types";
import { NetflixShell } from "../ui/NetflixShell";
import styles from "../ui/styles.css?inline";

const adapter = new YouTubePageAdapter();
let host: HTMLElement | null = null;
let root: Root | null = null;
let preferences: ExtensionPreferences;
let model: PageModel;
let stopped = false;

function applyDocumentMode() {
  const active = preferences.enabled && !preferences.nativeModeOverride && !model.nativeFallbackRegions.includes("page");
  document.documentElement.classList.toggle("cine-yt-active", active);
  document.documentElement.classList.toggle("cine-route-watch", active && model.route === "watch");
  if (host) host.style.display = active ? "block" : "none";
}

function render() {
  if (stopped || !root) return;
  applyDocumentMode();
  root.render(<NetflixShell model={model} preferences={preferences} />);
}

function refresh() {
  try {
    model = adapter.extract(document, new URL(location.href));
  } catch (error) {
    console.warn("[TubeFlix] Native fallback enabled after adapter error.", error);
    model = {
      route: detectRoute(new URL(location.href)),
      title: "YouTube",
      rails: [],
      loading: false,
      fallbackReason: "YouTube changed this page layout.",
      nativeFallbackRegions: ["page"]
    };
  }
  render();
}

async function start() {
  preferences = await readPreferences(chrome.storage);
  model = adapter.extract(document, new URL(location.href));
  if (!document.body) await new Promise<void>((resolve) => document.addEventListener("DOMContentLoaded", () => resolve(), { once: true }));
  host = document.getElementById("youtube-cinematic-host") ?? document.createElement("div");
  host.id = "youtube-cinematic-host";
  if (!host.isConnected) document.body.append(host);
  const shadow = host.shadowRoot ?? host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = styles;
  const mount = document.createElement("div");
  shadow.replaceChildren(style, mount);
  root = createRoot(mount);
  refresh();
  const stopAdapter = adapter.observe(refresh);
  const stopRoute = observeYouTubeRoute(() => window.setTimeout(refresh, 120));
  const stopPreferences = subscribeToPreferences((next) => { preferences = next; render(); }, chrome.storage);
  window.addEventListener("beforeunload", () => {
    stopped = true;
    stopAdapter();
    stopRoute();
    stopPreferences();
    adapter.dispose();
  }, { once: true });
}

void start().catch((error) => {
  document.documentElement.classList.remove("cine-yt-active", "cine-route-watch");
  console.error("[TubeFlix] The extension could not start.", error);
});
