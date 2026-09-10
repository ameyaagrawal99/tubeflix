import { useMemo, useState } from "react";
import type { ContentRail as ContentRailType, ExtensionPreferences, VideoItem } from "../core/types";
import { Icons } from "./Icon";
import { VideoCard } from "./VideoCard";

interface ContentRailProps {
  rail: ContentRailType;
  preferences: ExtensionPreferences;
  onDetails: (video: VideoItem) => void;
  preview?: boolean;
}

export function ContentRail({ rail, preferences, onDetails, preview = false }: ContentRailProps) {
  const [page, setPage] = useState(0);
  const pageSize = preferences.compactDensity ? 6 : 5;
  const pageCount = Math.max(1, Math.ceil(rail.videos.length / pageSize));
  const videos = useMemo(() => {
    if (rail.videos.length <= pageSize) return rail.videos;
    const start = page * pageSize;
    return [...rail.videos, ...rail.videos].slice(start, start + pageSize);
  }, [page, pageSize, rail.videos]);
  const move = (direction: number) => setPage((value) => (value + direction + pageCount) % pageCount);

  return (
    <section className={`cine-rail cine-rail--${rail.presentation}`} aria-labelledby={`rail-${rail.id}`}>
      <div className="cine-rail__header">
        <h2 id={`rail-${rail.id}`}>{rail.heading}</h2>
        {pageCount > 1 && (
          <div className="cine-rail__pages" aria-label={`Page ${page + 1} of ${pageCount}`}>
            {Array.from({ length: pageCount }, (_, index) => <span key={index} className={index === page ? "is-active" : ""} />)}
          </div>
        )}
      </div>
      <div className="cine-rail__viewport">
        {pageCount > 1 && <button className="cine-rail__arrow cine-rail__arrow--left" onClick={() => move(-1)} aria-label="Previous videos"><Icons.ChevronLeft size={38} /></button>}
        <div className="cine-rail__track">
          {videos.map((video, index) => (
            <VideoCard
              key={`${video.id}-${page}-${index}`}
              video={video}
              index={page * pageSize + index}
              presentation={rail.presentation}
              preferences={preferences}
              onDetails={onDetails}
              preview={preview}
            />
          ))}
        </div>
        {pageCount > 1 && <button className="cine-rail__arrow cine-rail__arrow--right" onClick={() => move(1)} aria-label="Next videos"><Icons.ChevronRight size={38} /></button>}
      </div>
    </section>
  );
}
