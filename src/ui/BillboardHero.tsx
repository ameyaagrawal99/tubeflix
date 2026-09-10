import type { HeroItem } from "../core/types";
import { Icons } from "./Icon";
import { Thumbnail } from "./Thumbnail";

interface BillboardHeroProps {
  hero: HeroItem;
  onDetails: () => void;
  preview?: boolean;
}

export function BillboardHero({ hero, onDetails, preview = false }: BillboardHeroProps) {
  const hasLongTitle = hero.video.title.length > 44;
  const play = () => {
    if (!preview) location.assign(hero.video.url);
  };
  return (
    <section className="cine-billboard" aria-label="Featured video">
      <Thumbnail className="cine-billboard__image" sources={[hero.backdrop, ...hero.video.thumbnails]} alt="" />
      <div className="cine-billboard__shade" />
      <div className={`cine-billboard__content ${hasLongTitle ? "is-long-title" : ""}`}>
        <h1 className={hasLongTitle ? "is-long-title" : undefined}>{hero.video.title}</h1>
        <p className="cine-billboard__synopsis">{hero.synopsis}</p>
        <div className="cine-billboard__metadata">
          {hero.metadata.map((item) => <span key={item}>{item}</span>)}
        </div>
        <div className="cine-billboard__actions">
          <button className="cine-button cine-button--light" onClick={play}>
            <Icons.Play size={25} fill="currentColor" /> Play
          </button>
          <button className="cine-button cine-button--glass" onClick={onDetails}>
            <Icons.Info size={26} /> More Info
          </button>
        </div>
      </div>
    </section>
  );
}
