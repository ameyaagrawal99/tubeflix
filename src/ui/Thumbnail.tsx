import { useEffect, useState } from "react";

interface ThumbnailProps {
  sources: string[];
  alt: string;
  className?: string;
}

export function Thumbnail({ sources, alt, className }: ThumbnailProps) {
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [sources]);
  const source = sources[index] || sources[sources.length - 1];
  if (!source) return <div className={`cine-thumbnail-fallback ${className ?? ""}`} aria-label={alt} />;
  return (
    <img
      className={className}
      src={source}
      alt={alt}
      loading="lazy"
      onError={() => setIndex((value) => Math.min(value + 1, sources.length - 1))}
    />
  );
}
