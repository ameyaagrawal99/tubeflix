import { describe, expect, it } from "vitest";
import { detectRoute } from "./routes";

describe("detectRoute", () => {
  it.each([
    ["https://www.youtube.com/", "home"],
    ["https://www.youtube.com/feed/subscriptions", "subscriptions"],
    ["https://www.youtube.com/results?search_query=design", "search"],
    ["https://www.youtube.com/watch?v=abc", "watch"],
    ["https://www.youtube.com/@creator", "channel"],
    ["https://www.youtube.com/feed/history", "history"],
    ["https://www.youtube.com/playlist?list=WL", "playlist"],
    ["https://www.youtube.com/shorts/abc", "shorts"]
  ])("maps %s to %s", (url, route) => expect(detectRoute(new URL(url))).toBe(route));
});
