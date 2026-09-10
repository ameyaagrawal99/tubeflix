import type { ExtensionPreferences } from "./types";

export const DEFAULT_PREFERENCES: ExtensionPreferences = {
  enabled: true,
  autoplayPreviews: true,
  reducedMotion: false,
  compactDensity: true,
  nativeModeOverride: false
};

const KEY = "youtubeCinematicPreferences";

type ChromeStorage = typeof chrome.storage;

export async function readPreferences(storage?: ChromeStorage): Promise<ExtensionPreferences> {
  if (!storage) return DEFAULT_PREFERENCES;
  const result = await storage.sync.get(KEY);
  return { ...DEFAULT_PREFERENCES, ...(result[KEY] ?? {}) };
}

export async function writePreferences(
  value: ExtensionPreferences,
  storage?: ChromeStorage
): Promise<void> {
  if (!storage) return;
  await storage.sync.set({ [KEY]: value });
}

export function subscribeToPreferences(
  listener: (preferences: ExtensionPreferences) => void,
  storage?: ChromeStorage
): () => void {
  if (!storage) return () => undefined;
  const handler = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
    if (area !== "sync" || !changes[KEY]?.newValue) return;
    listener({ ...DEFAULT_PREFERENCES, ...changes[KEY].newValue });
  };
  storage.onChanged.addListener(handler);
  return () => storage.onChanged.removeListener(handler);
}
