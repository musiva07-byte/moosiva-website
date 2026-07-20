type ProductQuantitySelectorProps = {
  value: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
};

export function ProductQuantitySelector({ value, max, disabled, onChange }: ProductQuantitySelectorProps) {
  return (
    <div>
      <p className="text-sm font-medium text-ink">Quantity</p>
      <div className="mt-2 inline-flex items-center rounded-full border border-border-input">
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={disabled || value <= 1}
          onClick={() => onChange(value - 1)}
          className="flex h-10 w-10 items-center justify-center text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>
        <span className="w-10 text-center text-sm font-medium text-ink">{value}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={disabled || value >= max}
          onClick={() => onChange(value + 1)}
          className="flex h-10 w-10 items-center justify-center text-ink disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}
