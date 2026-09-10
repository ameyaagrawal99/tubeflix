import { readFile } from "node:fs/promises";

const content = await readFile(new URL("../dist/content.js", import.meta.url), "utf8");

if (content.includes("process.env.NODE_ENV")) {
  throw new Error("dist/content.js contains process.env.NODE_ENV, which is unavailable in Chrome content scripts.");
}

if (!content.includes("youtube-cinematic-host")) {
  throw new Error("dist/content.js does not contain the extension mount point.");
}

console.log("Verified Chrome-safe content-script bundle.");
