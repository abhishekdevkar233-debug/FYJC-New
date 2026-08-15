import "./ChoiceCard.css";

interface ChoiceCardProps {
  name: string;
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

export function ChoiceCard({
  name,
  title,
  description,
  selected,
  onSelect,
  disabled,
}: ChoiceCardProps) {
  return (
    <label
      className={`choice-card ${selected ? "choice-card--selected" : ""} ${disabled ? "choice-card--disabled" : ""}`}
    >
      <input
        type="radio"
        name={name}
        className="choice-card-input"
        checked={selected}
        disabled={disabled}
        onChange={onSelect}
      />
      <span className="choice-card-radio" aria-hidden="true" />
      <span className="choice-card-text">
        <span className="choice-card-title">{title}</span>
        {description && <span className="choice-card-desc">{description}</span>}
      </span>
    </label>
  );
}
