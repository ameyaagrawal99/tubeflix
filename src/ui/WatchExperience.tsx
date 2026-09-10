import type { ExtensionPreferences, PageModel, VideoItem } from "../core/types";
import { ContentRail } from "./ContentRail";

interface WatchExperienceProps {
  model: PageModel;
  preferences: ExtensionPreferences;
  onDetails: (video: VideoItem) => void;
  preview?: boolean;
}

export function WatchExperience({ model, preferences, onDetails, preview = false }: WatchExperienceProps) {
  const current = model.hero?.video;
  return (
    <main className="cine-watch">
      <section className="cine-watch__stage" aria-label="YouTube player and recommendations">
        <div className="cine-watch__player-space">
          {preview && current && <img src={current.thumbnails[0]} alt="Video player preview" />}
          {preview && <span className="cine-watch__fake-controls">▶︎ &nbsp; 4:27 / 14:27</span>}
        </div>
        <aside className="cine-watch__up-next">
          <div className="cine-watch__up-next-title"><h2>Up Next</h2><span>Autoplay <i /></span></div>
          {(model.rails[0]?.videos ?? []).slice(0, 5).map((video) => (
            <button key={video.id} onClick={() => { if (!preview) location.assign(video.url); }}>
              <img src={video.thumbnails[0]} alt="" />
              <span><strong>{video.title}</strong><small>{video.channel}</small><small>{video.views} · {video.published}</small></span>
            </button>
          ))}
        </aside>
      </section>
      {current && (
        <section className="cine-watch__metadata">
          <h1>{current.title}</h1>
          <div><strong>{current.channel}</strong><span>{current.views} · {current.published}</span></div>
          <p>{current.description || `Watch ${current.title} from ${current.channel}.`}</p>
        </section>
      )}
      <div className="cine-watch__rails">
        {model.rails.slice(1).map((rail) => <ContentRail key={rail.id} rail={rail} preferences={preferences} onDetails={onDetails} preview={preview} />)}
      </div>
    </main>
  );
}
