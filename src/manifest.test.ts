import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("extension manifest", () => {
  it("uses Manifest V3 with only the approved permissions", () => {
    const manifest = JSON.parse(readFileSync("public/manifest.json", "utf8"));
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.permissions).toEqual(["storage"]);
    expect(manifest.host_permissions).toEqual(["https://www.youtube.com/*"]);
    expect(manifest.content_scripts[0]).toMatchObject({ run_at: "document_start", world: "ISOLATED" });
  });
});
