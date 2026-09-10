# TubeFlix

TubeFlix is a personal Manifest V3 Chrome extension that gives desktop YouTube a cinematic, rail-first browsing experience while keeping YouTube's account, playback, recommendations, subscriptions, comments, and controls intact.

It is a presentation layer, not a replacement for YouTube: TubeFlix does not use a recommendation API, run a backend, collect analytics, or export user data.

## What it does

- Reframes supported YouTube pages with a dark cinematic header, billboard, rails, ranked Top 10 cards, and details modal.
- Keeps navigation, search, Watch Later, likes, subscriptions, account controls, and player actions on YouTube.
- Supports Home, Search, Subscriptions, Explore, Watch, Channel, History, and playlist layouts, with native fallbacks for unsupported pages and Shorts.
- Includes settings for the experience, hover details, reduced motion, compact rail density, and restoring native YouTube.
- Preserves accessible focus handling, keyboard Escape-to-close, responsive layout, and native-page escape hatches.

## Why hover previews are static

Some YouTube creators disable embedding. Attempting to autoplay those videos in an iframe results in a disruptive “Video unavailable / Watch on YouTube” message. TubeFlix therefore keeps hover previews as high-quality thumbnails and metadata, while **Play** always opens the video through YouTube's native watch page. This is more reliable and respects creator embedding restrictions.

## Install locally

1. Download or clone this repository.
2. Run `npm install` and `npm run build`.
3. Open `chrome://extensions`, enable **Developer mode**, then choose **Load unpacked**.
4. Select the generated `dist` folder.
5. Open or refresh `https://www.youtube.com/`.

Use the TubeFlix toolbar popup to control the experience or return to native YouTube at any time.

## Develop and test

```bash
npm install
npm run check
npm run dev
```

- `/preview.html` is the standalone visual preview.
- `?modal=1` opens the details modal in the preview.
- `?route=watch` shows the player-safe watch layout.
- `npm run check` runs TypeScript checks, unit tests, production builds, and a Chrome content-script bundle safety check.

## Permissions and privacy

TubeFlix requests only:

- `storage` for settings synced through Chrome.
- `https://www.youtube.com/*` to render the presentation layer on YouTube.

There are no external network permissions, trackers, analytics, accounts, or servers.

## Compatibility

YouTube regularly updates its markup. Page extraction is isolated in `src/adapters/youtube.ts`; when data cannot be extracted, TubeFlix deliberately leaves the corresponding page native instead of fabricating content or breaking playback.

## License

MIT. TubeFlix is an independent project and is not affiliated with YouTube or Netflix.
