import { FormEvent, useEffect, useState } from "react";
import { Icons } from "./Icon";
import type { RouteKind } from "../core/types";

const LINKS: Array<{ label: string; href: string; routes: RouteKind[] }> = [
  { label: "Home", href: "/", routes: ["home"] },
  { label: "Subscriptions", href: "/feed/subscriptions", routes: ["subscriptions"] },
  { label: "Trending", href: "/feed/explore", routes: ["trending"] },
  { label: "History", href: "/feed/history", routes: ["history"] },
  { label: "My List", href: "/playlist?list=WL", routes: ["playlist"] }
];

interface TopNavigationProps {
  route: RouteKind;
  scrolled: boolean;
  preview?: boolean;
}

export function TopNavigation({ route, scrolled, preview = false }: TopNavigationProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [avatar, setAvatar] = useState("");
  useEffect(() => {
    if (route !== "search") setQuery("");
    if (!preview) {
      setAvatar(document.querySelector<HTMLImageElement>("#avatar-btn img, ytd-topbar-menu-button-renderer img")?.src ?? "");
    }
  }, [preview, route]);

  const navigate = (href: string) => {
    if (preview) return;
    location.assign(href);
  };
  const clickNative = (selector: string) => {
    if (preview) return;
    document.querySelector<HTMLElement>(selector)?.click();
  };
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    if (!query.trim() || preview) return;
    location.assign(`/results?search_query=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className={`cine-nav ${scrolled ? "cine-nav--solid" : ""}`}>
      <button className="cine-brand" onClick={() => navigate("/")} aria-label="TubeFlix home">
        <span className="cine-brand__mark">TF</span>
        <span className="cine-brand__name">TubeFlix</span>
      </button>
      <nav className="cine-nav__links" aria-label="Primary navigation">
        {LINKS.map((link) => (
          <button
            key={link.label}
            className={link.routes.includes(route) ? "is-active" : ""}
            onClick={() => navigate(link.href)}
          >
            {link.label}
          </button>
        ))}
      </nav>
      <div className="cine-nav__actions">
        <form className={`cine-search ${searchOpen ? "is-open" : ""}`} onSubmit={submitSearch}>
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen((value) => !value)}
          >
            <Icons.Search size={22} strokeWidth={2} />
          </button>
          <input
            aria-label="Search YouTube"
            placeholder="Titles, creators, topics"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            tabIndex={searchOpen ? 0 : -1}
          />
        </form>
        <button aria-label="Create" className="cine-icon-button" onClick={() => clickNative("ytd-topbar-menu-button-renderer button, button[aria-label*='Create']")}>
          <Icons.Plus size={25} />
        </button>
        <button aria-label="Notifications" className="cine-icon-button" onClick={() => clickNative("ytd-notification-topbar-button-renderer button, button[aria-label*='Notifications']")}>
          <Icons.Bell size={22} />
          <span className="cine-notification-dot" />
        </button>
        <button className="cine-avatar" aria-label="Account menu" onClick={() => clickNative("#avatar-btn, button[aria-label*='Account']")}>{avatar ? <img src={avatar} alt="" /> : "A"}</button>
      </div>
    </header>
  );
}
