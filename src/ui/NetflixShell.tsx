import { useEffect, useMemo, useState } from "react";
import type { ExtensionPreferences, PageModel, VideoItem } from "../core/types";
import { BillboardHero } from "./BillboardHero";
import { ContentRail } from "./ContentRail";
import { DetailsModal } from "./DetailsModal";
import { TopNavigation } from "./TopNavigation";
import { WatchExperience } from "./WatchExperience";

interface NetflixShellProps {
  model: PageModel;
  preferences: ExtensionPreferences;
  preview?: boolean;
  initialModal?: boolean;
}

export function NetflixShell({ model, preferences, preview = false, initialModal = false }: NetflixShellProps) {
  const [selected, setSelected] = useState<VideoItem | null>(initialModal ? model.hero?.video ?? null : null);
  const [scrolled, setScrolled] = useState(false);
  const allVideos = useMemo(() => model.rails.flatMap((rail) => rail.videos), [model.rails]);
  useEffect(() => {
    const onScroll = (event: Event) => setScrolled((event.target as HTMLElement).scrollTop > 36);
    const root = document.querySelector("#youtube-cinematic-scroll");
    root?.addEventListener("scroll", onScroll);
    return () => root?.removeEventListener("scroll", onScroll);
  }, []);

  if (model.nativeFallbackRegions.includes("page")) return null;
  const loading = model.loading && !model.hero;
  return (
    <div
      id="youtube-cinematic-scroll"
      className={`cine-app ${preferences.compactDensity ? "is-compact" : ""} ${preferences.reducedMotion ? "is-reduced-motion" : ""}`}
    >
      <TopNavigation route={model.route} scrolled={scrolled || model.route === "watch"} preview={preview} />
      {loading ? (
        <main className="cine-loading" aria-live="polite">
          <span className="cine-loader" />
          <h1>Building your cinematic view…</h1>
          <p>{model.fallbackReason}</p>
        </main>
      ) : model.route === "watch" ? (
        <WatchExperience model={model} preferences={preferences} onDetails={setSelected} preview={preview} />
      ) : (
        <main>
          {model.hero && <BillboardHero hero={model.hero} onDetails={() => setSelected(model.hero!.video)} preview={preview} />}
          <div className="cine-rails">
            {model.rails.map((rail) => <ContentRail key={rail.id} rail={rail} preferences={preferences} onDetails={setSelected} preview={preview} />)}
          </div>
        </main>
      )}
      {selected && <DetailsModal video={selected} related={allVideos.filter((item) => item.id !== selected.id)} onClose={() => setSelected(null)} preview={preview} />}
    </div>
  );
}
