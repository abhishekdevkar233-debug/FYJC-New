import "./PlaceholderSection.css";

interface PlaceholderSectionProps {
  title: string;
  description: string;
}

export function PlaceholderSection({ title, description }: PlaceholderSectionProps) {
  return (
    <div className="placeholder-section">
      <h1 className="placeholder-section-title">{title}</h1>
      <p className="placeholder-section-desc">{description}</p>
      <p className="placeholder-section-note">Page content coming soon.</p>
    </div>
  );
}
