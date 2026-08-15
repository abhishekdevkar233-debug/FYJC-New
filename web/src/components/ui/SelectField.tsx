import type { SelectHTMLAttributes } from "react";
import { useId } from "react";
import "./TextField.css";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
  error?: string;
}

export function SelectField({ label, options, error, id, className = "", ...rest }: SelectFieldProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;

  return (
    <div className={`ux4g-field ${className}`}>
      <label htmlFor={selectId} className="ux4g-field-label">
        {label} {rest.required && <span className="ux4g-field-required">*</span>}
      </label>
      <div className={`ux4g-field-control ${error ? "ux4g-field-control--error" : ""}`}>
        <select
          id={selectId}
          className="ux4g-field-input ux4g-field-select"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p id={errorId} className="ux4g-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
