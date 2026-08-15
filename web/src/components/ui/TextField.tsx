import type { InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";
import "./TextField.css";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
}

export function TextField({ label, error, icon, id, className = "", ...rest }: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className={`ux4g-field ${className}`}>
      <label htmlFor={inputId} className="ux4g-field-label">
        {label} {rest.required && <span className="ux4g-field-required">*</span>}
      </label>
      <div className={`ux4g-field-control ${error ? "ux4g-field-control--error" : ""}`}>
        {icon && (
          <span className="ux4g-field-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className="ux4g-field-input"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        />
      </div>
      {error && (
        <p id={errorId} className="ux4g-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
