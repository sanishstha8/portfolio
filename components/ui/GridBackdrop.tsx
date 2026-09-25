/**
 * Background: a fixed technical grid plus four column rules aligned to the
 * content shell. Both are heavily masked so they read as texture and vanish
 * the moment you look at the copy.
 */
export function GridBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div
        className="grid-field absolute inset-0"
        style={{
          maskImage:
            "radial-gradient(120% 90% at 50% 0%, black 0%, black 45%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(120% 90% at 50% 0%, black 0%, black 45%, transparent 100%)",
        }}
      />
      <div className="shell absolute inset-x-0 top-0 hidden h-full lg:block">
        <div className="relative grid h-full grid-cols-4">
          {[0, 1, 2, 3].map((column) => (
            <div key={column} className="border-l border-line-faint" />
          ))}
          <div className="absolute inset-y-0 right-0 border-r border-line-faint" />
        </div>
      </div>
    </div>
  );
}
