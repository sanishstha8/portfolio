type StatusDotProps = {
  className?: string;
  /** `idle` drops the pulse for dense lists where movement would be noise. */
  variant?: "live" | "idle";
};

/** Small accent LED. The pulse is CSS-driven, so reduced-motion stops it. */
export function StatusDot({ className = "", variant = "live" }: StatusDotProps) {
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex h-1.5 w-1.5 shrink-0 ${className}`}
    >
      {variant === "live" ? (
        <span className="absolute inset-0 animate-status-ring rounded-full bg-accent" />
      ) : null}
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
    </span>
  );
}
