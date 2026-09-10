import { useEffect, useRef } from "react";
import type { VideoItem } from "../core/types";
import { Icons } from "./Icon";
import { Thumbnail } from "./Thumbnail";

interface DetailsModalProps {
  video: VideoItem;
  related: VideoItem[];
  onClose: () => void;
  preview?: boolean;
}

export function DetailsModal({ video, related, onClose, preview = false }: DetailsModalProps) {
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const node = dialog.current;
    node?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !node) return;
      const items = [...node.querySelectorAll<HTMLElement>("button, a, [tabindex]:not([tabindex='-1'])")];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); previous?.focus(); };
  }, [onClose]);

  const play = () => { if (!preview) location.assign(video.url); };
  const add = () => {
    if (preview) return;
    if (video.actions.watchLaterElement) video.actions.watchLaterElement.click();
    else location.assign("/playlist?list=WL");
  };
  const like = () => {
    if (preview) return;
    if (video.actions.likeElement) video.actions.likeElement.click();
    else location.assign(video.url);
  };
  const episodes = [video, ...related].slice(0, 3);
  return (
    <div className="cine-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="cine-modal" role="dialog" aria-modal="true" aria-labelledby="cine-modal-title" ref={dialog} tabIndex={-1}>
        <section className="cine-modal__hero">
          <Thumbnail sources={video.thumbnails} alt="" />
          <div className="cine-modal__hero-shade" />
          <button className="cine-modal__close" onClick={onClose} aria-label="Close"><Icons.X size={23} /></button>
          <div className="cine-modal__hero-content">
            <h2 id="cine-modal-title">{video.title}</h2>
            <div className="cine-modal__hero-actions">
              <button className="cine-button cine-button--light" onClick={play}><Icons.Play size={21} fill="currentColor" /> Play</button>
              <button className="cine-round" onClick={add} aria-label="Add to My List"><Icons.Plus size={21} /></button>
              <button className="cine-round" onClick={like} aria-label="Like"><Icons.ThumbsUp size={20} /></button>
            </div>
          </div>
        </section>
        <section className="cine-modal__summary">
          <div>
            <div className="cine-modal__meta"><strong>98% match</strong><span>{video.published || "Recently added"}</span><span>{video.duration}</span><span className="cine-hd">HD</span><span className="cine-hd">CC</span></div>
            <p>{video.description || `Watch ${video.title} from ${video.channel}. This video was selected from your personal YouTube recommendations.`}</p>
            <p className="cine-modal__channel">{video.channel} · {video.views}</p>
          </div>
          <dl>
            <div><dt>Creator:</dt><dd>{video.channel}</dd></div>
            <div><dt>Topics:</dt><dd>{video.topics.join(", ")}</dd></div>
            <div><dt>Available:</dt><dd>On YouTube</dd></div>
          </dl>
        </section>
        <section className="cine-modal__episodes">
          <div className="cine-modal__section-title"><h3>Episodes &amp; Chapters</h3><button>Playlist <Icons.ChevronDown size={16} /></button></div>
          {episodes.map((item, index) => (
            <button className="cine-episode" key={`${item.id}-${index}`} onClick={() => { if (!preview) location.assign(item.url); }}>
              <span className="cine-episode__number">{index + 1}</span>
              <span className="cine-episode__image"><Thumbnail sources={item.thumbnails} alt="" /><span>{item.duration}</span></span>
              <span className="cine-episode__copy"><strong>{item.title}</strong><small>{item.channel}</small><span>{item.description || "Continue watching this recommended YouTube video."}</span></span>
              <Icons.Play className="cine-episode__play" size={20} fill="currentColor" />
            </button>
          ))}
        </section>
        <section className="cine-modal__related">
          <h3>More Like This</h3>
          <div>
            {related.slice(0, 6).map((item) => (
              <article key={item.id}>
                <div><Thumbnail sources={item.thumbnails} alt={item.title} /><span className="cine-duration">{item.duration}</span></div>
                <h4>{item.title}</h4>
                <p>{item.channel} · {item.views}</p>
                <button className="cine-round" aria-label={`Add ${item.title} to My List`}><Icons.Plus size={18} /></button>
              </article>
            ))}
          </div>
        </section>
        <section className="cine-modal__about"><h3>About this video</h3><p><strong>Creator:</strong> {video.channel}</p><p><strong>Topics:</strong> {video.topics.join(", ")}</p></section>
      </div>
    </div>
  );
}
