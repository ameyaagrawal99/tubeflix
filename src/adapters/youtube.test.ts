import { describe, expect, it } from "vitest";
import { extractVideo, YouTubePageAdapter } from "./youtube";

describe("YouTubePageAdapter", () => {
  it("normalizes a YouTube renderer", () => {
    document.body.innerHTML = `
      <ytd-rich-item-renderer>
        <a id="thumbnail" href="https://www.youtube.com/watch?v=abc123"><img src="https://i.ytimg.com/vi/abc123/hqdefault.jpg"></a>
        <a id="video-title-link" href="https://www.youtube.com/watch?v=abc123"><span id="video-title">A Great Video</span></a>
        <div id="channel-name"><a>Creator</a></div>
        <div id="metadata-line"><span>1.2M views</span><span>2 weeks ago</span></div>
        <ytd-thumbnail-overlay-time-status-renderer><span id="text">12:34</span></ytd-thumbnail-overlay-time-status-renderer>
        <div id="progress" style="width: 42%"></div>
      </ytd-rich-item-renderer>`;
    const result = extractVideo(document.querySelector("ytd-rich-item-renderer")!);
    expect(result).toMatchObject({ id: "abc123", title: "A Great Video", channel: "Creator", duration: "12:34", progress: 42 });
  });

  it("falls back to a loading model when renderers are absent", () => {
    document.body.innerHTML = "";
    const result = new YouTubePageAdapter().extract(document, new URL("https://www.youtube.com/"));
    expect(result.loading).toBe(true);
    expect(result.fallbackReason).toContain("Waiting");
  });
});
