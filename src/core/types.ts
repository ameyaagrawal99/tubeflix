export type RouteKind =
  | "home"
  | "subscriptions"
  | "trending"
  | "search"
  | "watch"
  | "channel"
  | "history"
  | "playlist"
  | "shorts"
  | "unsupported";

export type RailPresentation = "standard" | "progress" | "ranked" | "portrait";

export interface VideoActions {
  playUrl: string;
  nativeElement?: HTMLElement;
  watchLaterElement?: HTMLElement;
  likeElement?: HTMLElement;
}

export interface VideoItem {
  id: string;
  url: string;
  title: string;
  thumbnails: string[];
  duration: string;
  channel: string;
  views: string;
  published: string;
  progress: number;
  badges: string[];
  topics: string[];
  previewAvailable: boolean;
  description?: string;
  actions: VideoActions;
}

export interface ContentRail {
  id: string;
  heading: string;
  sourceOrder: number;
  presentation: RailPresentation;
  videos: VideoItem[];
}

export interface HeroItem {
  video: VideoItem;
  backdrop: string;
  synopsis: string;
  metadata: string[];
}

export interface PageModel {
  route: RouteKind;
  title: string;
  hero?: HeroItem;
  rails: ContentRail[];
  loading: boolean;
  fallbackReason?: string;
  nativeFallbackRegions: string[];
}

export interface ExtensionPreferences {
  enabled: boolean;
  autoplayPreviews: boolean;
  reducedMotion: boolean;
  compactDensity: boolean;
  nativeModeOverride: boolean;
}

export interface PageAdapter {
  matches(url: URL): boolean;
  extract(doc: Document, url: URL): PageModel;
  observe(onChange: () => void): () => void;
  dispose(): void;
}
