import { useRef, useState } from "react";
import type { ExtensionPreferences, RailPresentation, VideoItem } from "../core/types";
import { Icons } from "./Icon";
import { Thumbnail } from "./Thumbnail";

interface VideoCardProps {
  video: VideoItem;
  index: number;
  presentation: RailPresentation;
  preferences: ExtensionPreferences;
  onDetails: (video: VideoItem) => void;
  preview?: boolean;
}

export function VideoCard({ video, index, presentation, preferences, onDetails, preview = false }: VideoCardProps) {
  const [expanded, setExpanded] = useState(false);
  const timer = useRef<number>();
  const enter = () => {
    if (!preferences.autoplayPreviews) return;
    timer.current = window.setTimeout(() => setExpanded(true), preferences.reducedMotion ? 0 : 560);
  };
  const leave = () => {
    window.clearTimeout(timer.current);
    setExpanded(false);
  };
  const play = () => {
    if (!preview) location.assign(video.url);
  };
  const add = () => {
    if (preview) return;
    if (video.actions.watchLaterElement) video.actions.watchLaterElement.click();
    else location.assign(`/playlist?list=WL`);
  };
  const like = () => {
    if (preview) return;
    if (video.actions.likeElement) video.actions.likeElement.click();
    else location.assign(video.url);
  };

  return (
    <article
      className={`cine-card-wrap cine-card-wrap--${presentation} ${expanded ? "is-expanded" : ""}`}
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
    >
      {presentation === "ranked" && <span className="cine-rank" aria-hidden="true">{index + 1}</span>}
      <div className="cine-card" tabIndex={0} aria-label={`${video.title}, ${video.channel}`}>
        <div className="cine-card__media" onClick={play}>
          <Thumbnail sources={video.thumbnails} alt={video.title} />
          {video.duration && <span className="cine-duration">{video.duration}</span>}
          {video.progress > 0 && <span className="cine-progress" style={{ width: `${Math.min(video.progress, 100)}%` }} />}
        </div>
        <div className="cine-card__detail">
          <h3>{video.title}</h3>
          <div className="cine-card__actions">
            <button className="cine-round cine-round--light" onClick={play} aria-label="Play"><Icons.Play size={16} fill="currentColor" /></button>
            <button className="cine-round" onClick={add} aria-label="Add to My List"><Icons.Plus size={18} /></button>
            <button className="cine-round" onClick={like} aria-label="Like"><Icons.ThumbsUp size={17} /></button>
            <button className="cine-round cine-round--more" onClick={() => onDetails(video)} aria-label="More Info"><Icons.ChevronDown size={19} /></button>
          </div>
          <div className="cine-card__meta">
            <strong>98% match</strong>
            {video.published && <span>{video.published}</span>}
            {video.duration && <span>{video.duration}</span>}
            <span className="cine-hd">HD</span>
          </div>
          <div className="cine-card__topics">
            {video.topics.map((topic) => <span key={topic}>{topic}</span>)}
          </div>
        </div>
      </div>
    </article>
  );
}
