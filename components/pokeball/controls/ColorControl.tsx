import { colorPresets } from "../../../lib/pokeball/config";

export function ColorControl({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const selectedColor = value.toLowerCase();

  return (
    <div className="control-block">
      <div className="control-label">
        <span>{label}</span>
        <input
          className="color-input"
          aria-label={`${label} color picker`}
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
      <div className="swatch-row">
        {colorPresets.map((color) => (
          <button
            aria-label={`${label} ${color}`}
            className={`swatch ${selectedColor === color.toLowerCase() ? "selected" : ""}`}
            key={`${label}-${color}`}
            onClick={() => onChange(color)}
            style={{ backgroundColor: color }}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
