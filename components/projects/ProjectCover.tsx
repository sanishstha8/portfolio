import Image from "next/image";
import { MockupFrame } from "./visuals/MockupFrame";

type ProjectCoverProps = {
  src: string;
  /** Short context label for the chrome bar, e.g. "FEASTIO". */
  context: string;
  title: string;
  className?: string;
};

/**
 * Static preview image for the work index — the first real screenshot, no
 * swipe controls. This card's whole visual sits inside a decorative,
 * aria-hidden link (see `ProjectCard`), so it can't safely hold focusable
 * buttons; the full swipeable set lives on the case-study page
 * (`ProjectGallery`), one click away.
 */
export function ProjectCover({ src, context, title, className = "" }: ProjectCoverProps) {
  return (
    <MockupFrame context={context} path="Preview" caption={null} className={className}>
      <div className="relative aspect-[16/10] w-full bg-shade">
        <Image
          src={src}
          alt={`${title} preview screenshot`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-top"
        />
      </div>
    </MockupFrame>
  );
}
