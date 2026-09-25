import Link from "next/link";
import { site } from "@/lib/site";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer id="site-footer" className="relative border-t border-line-soft">
      <div className="shell">
        <div className="flex flex-col gap-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}
          </p>

          <div className="flex items-center gap-6">
            <Link href="/#work" className="transition-colors duration-300 hover:text-ink">
              Projects
            </Link>
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-ink"
            >
              GitHub
            </a>
            <a href="#top" className="transition-colors duration-300 hover:text-ink">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
