import { BAHRAIN_GOVERNORATES } from "@/lib/constants/bahrain";

export type AddressFieldValues = {
  governorate: string;
  area: string;
  block: string;
  road: string;
  building: string;
  flat: string;
  landmark: string;
  deliveryNotes: string;
};

type AddressFieldsProps = {
  values: AddressFieldValues;
  onChange: (field: keyof AddressFieldValues, value: string) => void;
};

const inputClassName =
  "h-11 w-full rounded-xl border border-border-input bg-surface px-3.5 text-sm text-ink transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15";

function TextField({
  id,
  label,
  value,
  onChange,
  optional,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  optional?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-1 ${className ?? ""}`}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
        {optional ? " (optional)" : ""}
      </label>
      <input id={id} type="text" value={value} onChange={(e) => onChange(e.target.value)} className={inputClassName} />
    </div>
  );
}

export function AddressFields({ values, onChange }: AddressFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1 sm:col-span-2">
        <label htmlFor="governorate" className="text-sm font-medium text-ink">
          Governorate
        </label>
        <select
          id="governorate"
          value={values.governorate}
          onChange={(e) => onChange("governorate", e.target.value)}
          className={inputClassName}
        >
          <option value="">Select governorate</option>
          {BAHRAIN_GOVERNORATES.map((governorate) => (
            <option key={governorate} value={governorate}>
              {governorate}
            </option>
          ))}
        </select>
      </div>

      <TextField id="area" label="Area" value={values.area} onChange={(v) => onChange("area", v)} />
      <TextField id="block" label="Block" value={values.block} onChange={(v) => onChange("block", v)} optional />
      <TextField id="road" label="Road" value={values.road} onChange={(v) => onChange("road", v)} optional />
      <TextField
        id="building"
        label="Building"
        value={values.building}
        onChange={(v) => onChange("building", v)}
        optional
      />
      <TextField
        id="flat"
        label="Flat / Apartment"
        value={values.flat}
        onChange={(v) => onChange("flat", v)}
        optional
      />
      <TextField
        id="landmark"
        label="Landmark"
        value={values.landmark}
        onChange={(v) => onChange("landmark", v)}
        optional
        className="sm:col-span-2"
      />

      <div className="space-y-1 sm:col-span-2">
        <label htmlFor="deliveryNotes" className="text-sm font-medium text-ink">
          Delivery notes (optional)
        </label>
        <textarea
          id="deliveryNotes"
          rows={3}
          value={values.deliveryNotes}
          onChange={(e) => onChange("deliveryNotes", e.target.value)}
          className="w-full rounded-xl border border-border-input bg-surface px-3.5 py-2.5 text-sm text-ink transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        />
      </div>
    </div>
  );
}
