import type { PublicCategory } from "@/types/public-product";

type ProductFiltersProps = {
  categories: PublicCategory[];
  selectedCategorySlug?: string;
  searchValue?: string;
};

/**
 * Plain GET form — no client JS needed. Submitting navigates to
 * /shop?q=...&category=..., which the server component re-reads.
 */
export function ProductFilters({ categories, selectedCategorySlug, searchValue }: ProductFiltersProps) {
  return (
    <form
      className="grid gap-3 sm:grid-cols-[1fr_180px_auto]"
      method="GET"
      action="/shop"
    >
      <div className="relative">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.5 15.5 5 5" /></svg>
        <input
          type="search"
          name="q"
          placeholder="Search products"
          defaultValue={searchValue}
          className="h-10 w-full rounded-full border border-border bg-surface px-4 pl-11 text-xs text-ink shadow-sm placeholder:text-ink-muted focus:border-primary focus:outline-none"
        />
      </div>
      {categories.length > 0 ? (
        <select
          name="category"
          defaultValue={selectedCategorySlug ?? ""}
          className="h-10 rounded-full border border-border bg-surface px-4 text-xs text-ink shadow-sm focus:border-primary focus:outline-none"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      ) : null}
      <button
        type="submit"
        className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-6 text-xs font-medium text-white shadow-[0_8px_18px_rgba(155,95,104,0.18)] transition-colors hover:bg-primary-hover"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 5h14M6 10h8M8 15h4M7 3v4M13 8v4M10 13v4" /></svg>
        Filter
      </button>
    </form>
  );
}
