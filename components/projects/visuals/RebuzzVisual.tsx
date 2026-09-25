import { MockupFrame } from "./MockupFrame";

const SIDEBAR_ITEMS = [72, 46, 58, 40, 64, 34];

const STAGES = [
  { label: "DATABASE", state: "done" },
  { label: "UPLOADS", state: "active" },
  { label: "THEMES", state: "queued" },
  { label: "PLUGINS", state: "queued" },
] as const;

const ARCHIVES = [
  { id: "SNAPSHOT-014", scope: "FILES + DB" },
  { id: "SNAPSHOT-013", scope: "FILES + DB" },
  { id: "SNAPSHOT-012", scope: "DATABASE" },
];

/** Drawn representation of the ReBuzz admin screen inside wp-admin. */
export function RebuzzVisual({ className }: { className?: string }) {
  return (
    <MockupFrame context="WP-ADMIN" path="PLUGINS / REBUZZ" className={className}>
      <div className="flex min-h-[16rem] @lg:min-h-[19rem]">
        {/* wp-admin rail */}
        <div
          aria-hidden="true"
          className="hidden w-14 shrink-0 flex-col gap-3 border-r border-line bg-shade/40 px-3 py-4 @sm:flex"
        >
          {SIDEBAR_ITEMS.map((width, index) => (
            <span
              key={index}
              className={`block h-1 rounded-full ${index === 4 ? "bg-accent/70" : "bg-black/12"}`}
              style={{ width: `${width}%` }}
            />
          ))}
        </div>

        {/* Screen */}
        <div className="min-w-0 flex-1 p-4 @lg:p-5">
          <p className="font-mono text-[0.875rem] tracking-tight text-ink">
            Backup &amp; Restore
          </p>

          {/* Run in progress */}
          <div className="mt-4 border border-line bg-shade/40 p-3.5">
            <div className="flex items-center justify-between gap-3">
              <span className="mono-micro text-muted">FULL SITE BACKUP</span>
              <span className="mono-micro text-accent">RUNNING</span>
            </div>

            {/* Segmented progress — schematic, not a measurement */}
            <div aria-hidden="true" className="mt-3 flex gap-[3px]">
              {Array.from({ length: 24 }).map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 flex-1 ${index < 15 ? "bg-accent" : "bg-black/10"}`}
                />
              ))}
            </div>

            <ul className="mt-3.5 flex flex-wrap gap-x-4 gap-y-2">
              {STAGES.map((stage) => (
                <li key={stage.label} className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className={`h-1 w-1 shrink-0 ${
                      stage.state === "done"
                        ? "bg-accent"
                        : stage.state === "active"
                          ? "bg-ink"
                          : "bg-faint"
                    }`}
                  />
                  <span
                    className={`mono-micro ${
                      stage.state === "queued" ? "text-faint" : "text-muted"
                    }`}
                  >
                    {stage.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stored archives */}
          <p className="mono-micro mt-5 text-faint">STORED ARCHIVES</p>
          <ul className="mt-2.5 border-t border-line-soft">
            {ARCHIVES.map((archive) => (
              <li
                key={archive.id}
                className="flex items-center justify-between gap-3 border-b border-line-soft py-2.5"
              >
                <span className="mono-micro truncate text-muted">{archive.id}</span>
                <span className="mono-micro hidden text-faint @xl:block">
                  {archive.scope}
                </span>
                <span className="mono-micro shrink-0 border border-line px-2 py-1 text-faint">
                  RESTORE
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MockupFrame>
  );
}
