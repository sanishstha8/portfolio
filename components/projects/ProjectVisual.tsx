import type { ProjectVisual as VisualKey } from "@/lib/projects";
import { RebuzzVisual } from "./visuals/RebuzzVisual";
import { FeastioVisual } from "./visuals/FeastioVisual";

type ProjectVisualProps = {
  visual: VisualKey;
  className?: string;
  /** Enables the Feastio module switcher on the case-study page. */
  interactive?: boolean;
};

/** Resolves a project's visual key to its drawn interface mockup. */
export function ProjectVisual({ visual, className, interactive = false }: ProjectVisualProps) {
  if (visual === "rebuzz") {
    return <RebuzzVisual className={className} />;
  }
  return <FeastioVisual className={className} interactive={interactive} />;
}
