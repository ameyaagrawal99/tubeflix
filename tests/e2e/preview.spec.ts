import { expect, test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const evidence = resolve(process.cwd(), "outputs", "qa-evidence");

test.beforeAll(async () => mkdir(evidence, { recursive: true }));

async function waitForMedia(page: import("@playwright/test").Page) {
  await expect.poll(async () => page.locator("img").evaluateAll((images) =>
    images.filter((image) => image.complete && image.naturalWidth > 0).length
  )).toBeGreaterThan(5);
}

test("home, hover preview, details modal, watch layout, and responsive shell", async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(message.text());
  });
  await page.goto("/preview.html");
  await expect(page).toHaveTitle("TubeFlix Preview");
  await expect(page.getByRole("heading", { name: "BEYOND THE MAP" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Top 10 in India Today" })).toBeVisible();
  await waitForMedia(page);
  await page.screenshot({ path: resolve(evidence, "home-1440x1000.png"), fullPage: false });

  const firstCard = page.locator(".cine-card").first();
  await firstCard.hover();
  await expect(firstCard.locator(".cine-card__detail")).toBeVisible();
  await expect(firstCard.locator("iframe")).toHaveCount(0);
  await page.screenshot({ path: resolve(evidence, "hover-1440x1000.png"), fullPage: false });

  await page.getByRole("button", { name: "More Info" }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Episodes & Chapters" })).toBeVisible();
  await page.screenshot({ path: resolve(evidence, "details-1440x1000.png"), fullPage: false });
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();

  await page.goto("/preview.html?route=watch");
  await expect(page.getByRole("heading", { name: "Up Next" })).toBeVisible();
  await expect(page.getByLabel("YouTube player and recommendations")).toBeVisible();
  await waitForMedia(page);
  await page.screenshot({ path: resolve(evidence, "watch-1440x1000.png"), fullPage: false });

  await page.setViewportSize({ width: 820, height: 900 });
  await page.goto("/preview.html");
  await expect(page.getByRole("heading", { name: "BEYOND THE MAP" })).toBeVisible();
  await waitForMedia(page);
  await expect(page.locator(".cine-app")).toHaveCSS("overflow-x", "hidden");
  await page.screenshot({ path: resolve(evidence, "home-820x900.png"), fullPage: false });
  expect(runtimeErrors).toEqual([]);
});
