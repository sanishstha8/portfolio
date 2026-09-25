import type { ReactNode } from "react";
import { StatusDot } from "@/components/ui/StatusDot";

type MockupFrameProps = {
  /** Left-hand label in the chrome bar, e.g. "WP-ADMIN". */
  context: string;
  /** Right-hand path/breadcrumb in the chrome bar. */
  path: string;
  children: ReactNode;
  className?: string;
  /**
   * Caption under the frame. Defaults to the "drawn, not a screenshot"
   * disclaimer, since that's true for every current caller — pass `null`
   * to omit it for a frame holding a real image, where it would be false.
   */
  caption?: string | null;
};

const DEFAULT_CAPTION = "An illustration of the interface, not a real screenshot.";

/** Window chrome shared by the project visuals: a drawn mockup or a real screenshot. */
export function MockupFrame({
  context,
  path,
  children,
  className = "",
  caption = DEFAULT_CAPTION,
}: MockupFrameProps) {
  return (
    <figure className={`relative ${className}`}>
      <div className="@container overflow-hidden border border-line bg-panel">
        <div className="flex items-center justify-between gap-4 border-b border-line bg-shade/60 px-3 py-2.5">
          <span className="flex items-center gap-2 text-xs font-medium text-muted">
            <StatusDot variant="idle" />
            {context}
          </span>
          <span className="truncate text-xs text-faint">{path}</span>
        </div>
        <div className="relative">{children}</div>
      </div>
      {caption ? <figcaption className="mt-3 text-sm text-muted">{caption}</figcaption> : null}
    </figure>
  );
}
