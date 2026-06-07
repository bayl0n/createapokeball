export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="control-block">
      <span className="section-label">{label}</span>
      <div className="segment-grid">
        {options.map((option) => (
          <button
            className={`segment ${value === option.value ? "selected" : ""}`}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
