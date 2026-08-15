import { useEffect, useState } from "react";
import "./AccessibilityBar.css";

const MIN_SCALE = 87.5;
const MAX_SCALE = 125;
const STEP = 12.5;

export function AccessibilityBar() {
  const [scale, setScale] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${scale}%`;
  }, [scale]);

  useEffect(() => {
    document.documentElement.setAttribute("data-contrast", highContrast ? "high" : "normal");
  }, [highContrast]);

  return (
    <div className="a11y-bar">
      <div className="a11y-bar-inner">
        <div className="a11y-font-controls" role="group" aria-label="Adjust text size">
          <button
            type="button"
            className="a11y-btn"
            onClick={() => setScale((s) => Math.max(MIN_SCALE, s - STEP))}
            disabled={scale <= MIN_SCALE}
            aria-label="Decrease text size"
          >
            A-
          </button>
          <button
            type="button"
            className={`a11y-btn ${scale === 100 ? "a11y-btn--active" : ""}`}
            onClick={() => setScale(100)}
            aria-label="Reset text size"
          >
            A
          </button>
          <button
            type="button"
            className="a11y-btn"
            onClick={() => setScale((s) => Math.min(MAX_SCALE, s + STEP))}
            disabled={scale >= MAX_SCALE}
            aria-label="Increase text size"
          >
            A+
          </button>
        </div>

        <button
          type="button"
          className={`a11y-btn a11y-contrast ${highContrast ? "a11y-btn--active" : ""}`}
          onClick={() => setHighContrast((v) => !v)}
          aria-pressed={highContrast}
          aria-label="Toggle high contrast mode"
        >
          <ContrastIcon />
        </button>

        <div className="a11y-lang" aria-label="Language: English">
          <GlobeIcon />
          <span>English</span>
        </div>
      </div>
    </div>
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

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" strokeLinecap="round" />
    </svg>
  );
}
