import { detectRoute } from "../core/routes";
import type { ContentRail, PageAdapter, PageModel, RailPresentation, VideoItem } from "../core/types";

const RENDERER_SELECTOR = [
  "ytd-rich-item-renderer",
  "ytd-video-renderer",
  "ytd-grid-video-renderer",
  "ytd-compact-video-renderer",
  "ytd-playlist-video-renderer",
  "ytd-reel-item-renderer"
].join(",");

function text(root: Element, selectors: string): string {
  return (root.querySelector(selectors)?.textContent ?? "").replace(/\s+/g, " ").trim();
}

function getVideoId(url: string): string {
  try {
    const parsed = new URL(url, location.origin);
    return parsed.searchParams.get("v") ?? parsed.pathname.split("/").filter(Boolean).pop() ?? "";
  } catch {
    return "";
  }
}

function thumbnailCandidates(id: string, source: string): string[] {
  const candidates = source ? [source] : [];
  if (id) candidates.push(
    `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${id}/hq720.jpg`,
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
  );
  return [...new Set(candidates)];
}

export function extractVideo(renderer: Element): VideoItem | null {
  const link = renderer.querySelector<HTMLAnchorElement>(
    "a#video-title-link, a#video-title, a#thumbnail, a[href*='/watch?v='], a[href*='/shorts/']"
  );
  const url = link?.href ?? "";
  const id = getVideoId(url);
  const title =
    text(renderer, "#video-title") ||
    text(renderer, "#video-title-link") ||
    link?.getAttribute("title")?.trim() ||
    "Untitled video";
  if (!url || !id) return null;

  const image = renderer.querySelector<HTMLImageElement>("yt-image img, img");
  const metadata = [...renderer.querySelectorAll("#metadata-line span")]
    .map((item) => item.textContent?.trim() ?? "")
    .filter(Boolean);
  const duration =
    text(renderer, "ytd-thumbnail-overlay-time-status-renderer #text") ||
    text(renderer, "#text.ytd-thumbnail-overlay-time-status-renderer") ||
    text(renderer, "[overlay-style] #text");
  const progressEl = renderer.querySelector<HTMLElement>("#progress");
  const progress = Number.parseFloat(progressEl?.style.width ?? "0") || 0;
  const badges = [...renderer.querySelectorAll("ytd-badge-supported-renderer, .badge")]
    .map((item) => item.textContent?.trim() ?? "")
    .filter(Boolean);
  const channel =
    text(renderer, "#channel-name a") || text(renderer, "ytd-channel-name") || "YouTube";

  return {
    id,
    url,
    title,
    thumbnails: thumbnailCandidates(id, image?.currentSrc || image?.src || ""),
    duration,
    channel,
    views: metadata[0] ?? "",
    published: metadata[1] ?? "",
    progress,
    badges,
    topics: [channel, "YouTube", badges[0] || "Recommended"].filter(Boolean).slice(0, 3),
    previewAvailable: !url.includes("/shorts/"),
    description: text(renderer, "#description-text, .metadata-snippet-text"),
    actions: {
      playUrl: url,
      nativeElement: renderer as HTMLElement,
      watchLaterElement: renderer.querySelector<HTMLElement>(
        "ytd-thumbnail-overlay-toggle-button-renderer, button[aria-label*='Watch later']"
      ) ?? undefined
    }
  };
}

function uniqueVideos(doc: Document): VideoItem[] {
  const seen = new Set<string>();
  return [...doc.querySelectorAll(RENDERER_SELECTOR)]
    .map(extractVideo)
    .filter((video): video is VideoItem => {
      if (!video || seen.has(video.id)) return false;
      seen.add(video.id);
      return true;
    });
}

function extractCurrentWatchVideo(doc: Document, url: URL): VideoItem | null {
  const id = url.searchParams.get("v") ?? "";
  const title = text(doc.documentElement, "ytd-watch-metadata h1, #title h1, h1.title");
  if (!id || !title) return null;
  const metadata = [...doc.querySelectorAll("ytd-watch-info-text #info span, #info-strings yt-formatted-string")]
    .map((item) => item.textContent?.trim() ?? "")
    .filter(Boolean);
  const channel = text(doc.documentElement, "ytd-watch-metadata #channel-name a, #owner-name a") || "YouTube";
  const poster = doc.querySelector<HTMLMetaElement>("meta[itemprop='thumbnailUrl'], meta[property='og:image']")?.content ?? "";
  return {
    id,
    url: url.href,
    title,
    thumbnails: thumbnailCandidates(id, poster),
    duration: text(doc.documentElement, ".ytp-time-duration"),
    channel,
    views: metadata[0] ?? "",
    published: metadata[1] ?? "",
    progress: 0,
    badges: [],
    topics: [channel, "YouTube", "Recommended"],
    previewAvailable: false,
    description: text(doc.documentElement, "ytd-text-inline-expander #plain-snippet-text, #description-inline-expander"),
    actions: {
      playUrl: url.href,
      watchLaterElement: doc.querySelector<HTMLElement>("button[aria-label*='Save'], ytd-menu-renderer button[aria-label*='Save']") ?? undefined,
      likeElement: doc.querySelector<HTMLElement>("like-button-view-model button, #segmented-like-button button") ?? undefined
    }
  };
}

function rail(
  id: string,
  heading: string,
  presentation: RailPresentation,
  videos: VideoItem[],
  sourceOrder: number
): ContentRail | null {
  if (!videos.length) return null;
  return { id, heading, presentation, videos, sourceOrder };
}

function routeTitle(route: PageModel["route"], url: URL): string {
  if (route === "search") return `Results for “${url.searchParams.get("search_query") ?? "Search"}”`;
  const labels: Partial<Record<PageModel["route"], string>> = {
    home: "Home",
    subscriptions: "Subscriptions",
    trending: "Trending",
    watch: "Watch",
    channel: "Channel",
    history: "History",
    playlist: "Playlist",
    shorts: "Shorts"
  };
  return labels[route] ?? "YouTube";
}

export class YouTubePageAdapter implements PageAdapter {
  private cleanup?: () => void;

  matches(url: URL): boolean {
    return url.hostname === "www.youtube.com";
  }

  extract(doc: Document, url: URL): PageModel {
    const route = detectRoute(url);
    const videos = uniqueVideos(doc);
    if (route === "watch") {
      const current = extractCurrentWatchVideo(doc, url);
      if (current) {
        const duplicate = videos.findIndex((video) => video.id === current.id);
        if (duplicate >= 0) videos.splice(duplicate, 1);
        videos.unshift(current);
      }
    }
    if (route === "shorts" || route === "unsupported") {
      return {
        route,
        title: routeTitle(route, url),
        rails: [],
        loading: false,
        fallbackReason: "This YouTube layout is kept native.",
        nativeFallbackRegions: ["page"]
      };
    }

    const heroVideo = videos[0];
    const progressVideos = videos.filter((video) => video.progress > 0);
    const rails = [
      rail("continue", route === "home" ? "Continue Watching for You" : routeTitle(route, url), "progress", progressVideos.length ? progressVideos : videos.slice(0, 6), 0),
      rail("top", "Top 10 in India Today", "ranked", videos.slice(6, 16), 1),
      rail("trending", route === "search" ? "Top Results" : "Trending Now", "standard", videos.slice(16, 28), 2),
      rail("subscriptions", route === "channel" ? "From this creator" : "New from Your Subscriptions", "standard", videos.slice(28, 40), 3),
      rail("more", route === "watch" ? "More Like This" : "Because You Watched", "standard", videos.slice(40, 54), 4)
    ].filter((item): item is ContentRail => Boolean(item));

    if (!rails.length && videos.length) {
      rails.push({ id: "all", heading: routeTitle(route, url), presentation: "standard", videos, sourceOrder: 0 });
    }

    return {
      route,
      title: routeTitle(route, url),
      hero: heroVideo
        ? {
            video: heroVideo,
            backdrop: heroVideo.thumbnails[0],
            synopsis:
              heroVideo.description ||
              `Watch ${heroVideo.title} from ${heroVideo.channel}, selected from your YouTube recommendations.`,
            metadata: [heroVideo.channel, heroVideo.views, heroVideo.published].filter(Boolean)
          }
        : undefined,
      rails,
      loading: videos.length === 0,
      fallbackReason: videos.length === 0 ? "Waiting for YouTube recommendations…" : undefined,
      nativeFallbackRegions: []
    };
  }

  observe(onChange: () => void): () => void {
    let timeout = 0;
    const observer = new MutationObserver(() => {
      window.clearTimeout(timeout);
      timeout = window.setTimeout(onChange, 220);
    });
    const start = () => observer.observe(document.documentElement, { childList: true, subtree: true });
    start();
    this.cleanup = () => {
      window.clearTimeout(timeout);
      observer.disconnect();
    };
    return this.cleanup;
  }

  dispose(): void {
    this.cleanup?.();
  }
}
