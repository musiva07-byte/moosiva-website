type ProductOptionSelectorProps = {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
};

export function ProductOptionSelector({ label, options, selected, onSelect }: ProductOptionSelectorProps) {
  return (
    <div>
      <p className="text-sm font-medium text-ink">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option === selected;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(option)}
              className={
                isSelected
                  ? "rounded-full border border-primary bg-primary px-4 py-2 text-sm font-medium text-white"
                  : "rounded-full border border-border-input px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-primary hover:text-primary"
              }
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
