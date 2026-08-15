import { useCallback, useId } from "react";
import "./CaptchaField.css";

const CAPTCHA_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateCode(length = 6): string {
  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)];
  }
  return code;
}

interface CaptchaFieldProps {
  value: string;
  onChange: (value: string) => void;
  code: string;
  onRefresh: (code: string) => void;
  error?: string;
}

export function CaptchaField({ value, onChange, code, onRefresh, error }: CaptchaFieldProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;

  const handleRefresh = useCallback(() => {
    onRefresh(generateCode());
  }, [onRefresh]);

  return (
    <div className="ux4g-captcha">
      <div className="ux4g-captcha-row">
        <div className="ux4g-captcha-code" aria-label={`Captcha code: ${code.split("").join(" ")}`}>
          <span aria-hidden="true">{code}</span>
          <button
            type="button"
            className="ux4g-captcha-refresh"
            onClick={handleRefresh}
            aria-label="Generate a new captcha code"
          >
            <RefreshIcon />
          </button>
        </div>
        <div className={`ux4g-field-control ${error ? "ux4g-field-control--error" : ""}`}>
          <input
            id={inputId}
            className="ux4g-field-input"
            placeholder="Enter the code above"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            autoComplete="off"
          />
        </div>
      </div>
      {error && (
        <p id={errorId} className="ux4g-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export { generateCode };

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}
