import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="shell flex min-h-[70vh] flex-col justify-center py-32">
      <p className="section-eyebrow">Error 404</p>
      <h1 className="section-title mt-3 text-ink">This page doesn&rsquo;t exist.</h1>
      <p className="body-lg mt-5 max-w-md text-body">
        The page you asked for is not here. Nothing is broken on your end.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-full bg-accent px-6 py-3.5 font-semibold text-canvas transition-colors duration-300 hover:bg-accent-hover"
        >
          Back to home
        </Link>
        <Link
          href="/#work"
          className="rounded-full border border-line px-6 py-3.5 font-semibold text-ink transition-colors duration-300 hover:border-line-strong"
        >
          See my projects
        </Link>
      </div>
    </div>
  );
}
