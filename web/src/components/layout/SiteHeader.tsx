import type { ReactNode, RefObject } from "react";
import "./SiteHeader.css";

interface SiteHeaderProps {
  rightContent?: ReactNode;
  mobileMenu?: ReactNode;
  mobileMenuOpen?: boolean;
  mobileMenuRef?: RefObject<HTMLDivElement | null>;
}

export function SiteHeader({ rightContent, mobileMenu, mobileMenuOpen, mobileMenuRef }: SiteHeaderProps) {
  return (
    <>
      <header className="app-header">
        <div className="app-header-inner">
          {rightContent && <div className="app-header-actions">{rightContent}</div>}
        </div>

        {mobileMenu && (
          <div
            ref={mobileMenuRef}
            className={`app-mobile-menu ${mobileMenuOpen ? "is-open" : ""}`}
            role="menu"
            aria-label="Mobile navigation"
          >
            {mobileMenu}
          </div>
        )}
      </header>
    </>
  );
}
