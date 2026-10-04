import { site } from "@/data/site-content";

export function SiteFooter() {
  return (
    <footer className="site-footer" data-header-theme="dark">
      <div className="page-container site-footer__inner">
        <p className="mono-label">{site.name} · Gold Coast, Australia · © 2026</p>
        <a className="mono-label site-footer__top only-desktop" href="#main-content">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
