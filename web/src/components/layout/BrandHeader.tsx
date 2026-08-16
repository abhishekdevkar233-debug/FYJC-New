import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import logo1 from "../../assets/logo-1.svg";
import logo2 from "../../assets/logo-2.svg";
import logoDivider from "../../assets/logo-divider.svg";
import { useLanguage } from "../../context/LanguageContext";
import type { AppLanguage } from "../../context/LanguageContext";
import "./BrandHeader.css";

const LANGUAGES: AppLanguage[] = ["EN", "HI", "MR"];
const MIN_SCALE = 87.5;
const MAX_SCALE = 125;
const SCALE_STEP = 12.5;

export function BrandHeader({ children }: { children?: ReactNode }) {
  const { language, setLanguage } = useLanguage();
  const [scale, setScale] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${scale}%`;
  }, [scale]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-contrast",
      highContrast ? "high" : "normal",
    );
  }, [highContrast]);

  return (
    <header className="brand-topnav">
      <div className="brand-topnav-brand">
        <img
          src={logo1}
          alt="Government of Maharashtra emblem"
          className="brand-topnav-logo"
        />
        <img
          src={logoDivider}
          alt=""
          aria-hidden="true"
          className="brand-topnav-divider"
        />
        <img
          src={logo2}
          alt="School Education and Sports Department emblem"
          className="brand-topnav-logo"
        />
        <div className="brand-topnav-text">
          <span className="brand-topnav-title">Government of Maharashtra</span>
          <span className="brand-topnav-subtitle">
            School Education and Sports Department
          </span>
          <span className="brand-topnav-caption">
            Std. 11th Centralised Online Admission Process 2026&ndash;27
          </span>
        </div>
      </div>

      <div className="brand-topnav-toolbar">
        <div className="brand-a11y" role="group" aria-label="Accessibility settings">
          <div
            className="brand-a11y-font"
            role="group"
            aria-label="Adjust text size"
          >
            <button
              type="button"
              className="brand-a11y-btn"
              onClick={() => setScale((s) => Math.max(MIN_SCALE, s - SCALE_STEP))}
              disabled={scale <= MIN_SCALE}
              aria-label="Decrease text size"
            >
              A-
            </button>
            <button
              type="button"
              className={`brand-a11y-btn ${scale === 100 ? "brand-a11y-btn--active" : ""}`}
              onClick={() => setScale(100)}
              aria-label="Reset text size"
            >
              A
            </button>
            <button
              type="button"
              className="brand-a11y-btn"
              onClick={() => setScale((s) => Math.min(MAX_SCALE, s + SCALE_STEP))}
              disabled={scale >= MAX_SCALE}
              aria-label="Increase text size"
            >
              A+
            </button>
          </div>

          <button
            type="button"
            className={`brand-a11y-btn brand-a11y-contrast ${highContrast ? "brand-a11y-btn--active" : ""}`}
            onClick={() => setHighContrast((v) => !v)}
            aria-pressed={highContrast}
            aria-label="Toggle high contrast mode"
          >
            <ContrastIcon />
          </button>
        </div>

        <div className="brand-topnav-lang" role="group" aria-label="Select language">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              className={`brand-topnav-lang-btn ${language === lang ? "brand-topnav-lang-btn--active" : ""}`}
              onClick={() => setLanguage(lang)}
              aria-pressed={language === lang}
              aria-label={`Switch language to ${lang}`}
            >
              {lang}
            </button>
          ))}
        </div>

        {children && <div className="brand-topnav-actions">{children}</div>}
      </div>
    </header>
  );
}

function ContrastIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
