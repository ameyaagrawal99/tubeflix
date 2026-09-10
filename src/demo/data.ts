import type { PageModel, VideoItem } from "../core/types";

const samples = [
  ["Beyond the Map", "dQw4w9WgXcQ", "Roam Further", "1.8M views", "2 weeks ago", "14:27"],
  ["Mountain Escapes", "ysz5S6PUM-U", "Wild Earth", "2.4M views", "3 weeks ago", "12:34"],
  ["Street Food India", "aqz-KE-bpKQ", "Kitchen Diary", "846K views", "1 month ago", "08:21"],
  ["Hidden Coasts of Japan", "ScMzIvxBSi4", "Wander More", "1.2M views", "2 weeks ago", "14:08"],
  ["Ocean Life", "M7lc1UVf-VE", "Blue Planet", "923K views", "1 month ago", "16:08"],
  ["Study With Me", "jNQXAC9IVRw", "Productive Day", "730K views", "3 weeks ago", "22:17"],
  ["Train Journeys", "kJQP7kiw5Fk", "Roam Together", "1.1M views", "1 month ago", "10:03"],
  ["Gaming Setups", "9bZkp7q19f0", "Build Better", "2.7M views", "2 months ago", "18:04"],
  ["Wild Elephant Minds", "3JZ_D3ELwOQ", "Nature Lens", "3.2M views", "2 weeks ago", "11:42"],
  ["Tokyo After Dark", "OPf0YbXqDm0", "Urban Explorer", "976K views", "3 months ago", "20:14"],
  ["A Quiet Morning", "RgKAFK5djSk", "Everyday Calm", "1.3M views", "4 weeks ago", "09:18"],
  ["Cooking With Fire", "60ItHLz5WEA", "Kitchen Diary", "1.7M views", "1 month ago", "15:44"]
] as const;

export const demoVideos: VideoItem[] = samples.map(([title, id, channel, views, published, duration], index) => ({
  id,
  title,
  channel,
  views,
  published,
  duration,
  url: `https://www.youtube.com/watch?v=${id}`,
  thumbnails: [`https://i.ytimg.com/vi/${id}/hqdefault.jpg`],
  progress: index < 6 ? [46, 72, 18, 54, 35, 62][index] : 0,
  badges: [],
  topics: [index % 2 ? "Travel" : "Documentary", "Adventure", channel],
  previewAvailable: true,
  description: `A cinematic journey from ${channel}, selected from your YouTube recommendations.`,
  actions: { playUrl: `https://www.youtube.com/watch?v=${id}` }
}));

const repeated = (start: number, length = 10) => Array.from({ length }, (_, index) => demoVideos[(start + index) % demoVideos.length]);

export function buildDemoModel(route: PageModel["route"] = "home"): PageModel {
  return {
    route,
    title: route === "watch" ? "Watch" : "Home",
    loading: false,
    nativeFallbackRegions: [],
    hero: {
      video: demoVideos[0],
      backdrop: demoVideos[0].thumbnails[0],
      synopsis: "Extraordinary places. Real people. A deeper look at the world beyond the usual route.",
      metadata: ["Travel", "2024", "1h 14m", "Nature"]
    },
    rails: [
      { id: "continue", heading: "Continue Watching for Ameya", presentation: "progress", sourceOrder: 0, videos: repeated(1, 8) },
      { id: "top", heading: "Top 10 in India Today", presentation: "ranked", sourceOrder: 1, videos: repeated(2, 10) },
      { id: "trending", heading: "Trending Now", presentation: "standard", sourceOrder: 2, videos: repeated(4, 10) },
      { id: "subscriptions", heading: "New from Your Subscriptions", presentation: "standard", sourceOrder: 3, videos: repeated(6, 10) }
    ]
  };
}
