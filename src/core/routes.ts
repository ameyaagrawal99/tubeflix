import type { RouteKind } from "./types";

export function detectRoute(url: URL): RouteKind {
  const path = url.pathname;
  if (path === "/" || path === "") return "home";
  if (path === "/feed/subscriptions") return "subscriptions";
  if (path === "/feed/trending" || path === "/feed/explore") return "trending";
  if (path === "/results") return "search";
  if (path === "/watch") return "watch";
  if (path === "/feed/history") return "history";
  if (path === "/playlist") return "playlist";
  if (path.startsWith("/shorts/")) return "shorts";
  if (/^\/(?:@|channel\/|c\/|user\/)/.test(path)) return "channel";
  return "unsupported";
}

export function observeYouTubeRoute(onChange: () => void): () => void {
  let lastUrl = location.href;
  const check = () => {
    if (location.href === lastUrl) return;
    lastUrl = location.href;
    onChange();
  };
  const events = ["yt-navigate-finish", "yt-page-data-updated", "popstate"];
  events.forEach((event) => window.addEventListener(event, check));
  const interval = window.setInterval(check, 750);
  return () => {
    events.forEach((event) => window.removeEventListener(event, check));
    window.clearInterval(interval);
  };
}
