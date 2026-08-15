import type { ReactNode, RefObject } from "react";
import { AccessibilityBar } from "./AccessibilityBar";
import brandMarkPlaceholder from "../../assets/brand-mark-placeholder.svg";
import brandLogoPlaceholder from "../../assets/brand-logo-placeholder.svg";
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
      <AccessibilityBar />
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand" aria-label="Application brand">
            <div className="app-brand-mark" aria-hidden="true">
              <img src={brandMarkPlaceholder} alt="" width="48" height="48" />
            </div>

            <span className="app-brand-divider" aria-hidden="true" />

            <div className="app-brand-logo" aria-hidden="true">
              <img src={brandLogoPlaceholder} alt="" width="46" height="46" />
            </div>

            <div className="app-brand-copy">
              <span className="app-brand-title">
                Government of Maharashtra, School Education and Sports Department
              </span>
              <span className="app-brand-subtitle">
                Std. 11th Centralised Online Admission Process 2026&ndash;27
              </span>
            </div>
          </div>

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
