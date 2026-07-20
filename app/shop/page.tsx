import type { Metadata } from "next";
import Link from "next/link";

import { ProductEmptyState } from "@/components/product/product-empty-state";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { getPublishedCategories, getPublishedProducts } from "@/lib/services/products";

export const metadata: Metadata = {
  title: "Shop Moosiva",
  description: "Browse the latest available pieces from Moosiva Lux Wear.",
};

type ShopPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const search = getParam(params, "q") ?? "";
  const categorySlug = getParam(params, "category") ?? "";
  const page = Number(getParam(params, "page") ?? 1);

  const [categories, result] = await Promise.all([
    getPublishedCategories(),
    getPublishedProducts({
      page,
      search: search || undefined,
      categorySlug: categorySlug || undefined,
    }),
  ]);

  const hrefForPage = (nextPage: number) => {
    const next = new URLSearchParams();
    if (search) next.set("q", search);
    if (categorySlug) next.set("category", categorySlug);
    next.set("page", String(nextPage));
    return `/shop?${next.toString()}`;
  };

  return (
    <main>
      <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_50%_20%,var(--bg-surface)_0%,var(--bg-soft)_90%)]">
        <svg className="pointer-events-none absolute -bottom-10 right-0 h-40 w-52 text-primary opacity-[0.09]" viewBox="0 0 210 150" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M210 130C168 94 134 72 75 48" /><path d="M143 83c3-32 18-49 38-57 2 27-10 48-38 57ZM119 69c-17-24-38-31-59-27 12 22 32 32 59 27ZM173 105c5-25 18-38 35-44 0 22-10 37-35 44Z" /><path d="M115 54c8-25 26-39 49-41-4 24-20 39-49 41Z" /></svg>
        <div className="relative mx-auto max-w-5xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl text-rose-deep">Shop Moosiva</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Browse the latest available pieces from Moosiva Lux Wear.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl space-y-5 px-4 py-5 sm:px-6 lg:px-8">
        <ProductFilters
          categories={categories}
          selectedCategorySlug={categorySlug || undefined}
          searchValue={search || undefined}
        />

        {result.loadError ? (
          <ProductEmptyState variant="error" />
        ) : result.items.length === 0 ? (
          <ProductEmptyState variant="empty" />
        ) : (
          <>
            <ProductGrid products={result.items} />

            {result.pageCount > 1 && (
              <nav
                aria-label="Product pagination"
                className="flex items-center justify-center gap-4 pt-4 text-sm"
              >
                {result.page > 1 ? (
                  <Link
                    href={hrefForPage(result.page - 1)}
                    className="rounded-full border border-border-input px-4 py-2 text-ink transition-colors hover:border-primary hover:text-primary"
                  >
                    Previous
                  </Link>
                ) : (
                  <span className="rounded-full border border-border-input px-4 py-2 text-ink-muted opacity-50">
                    Previous
                  </span>
                )}

                <span className="text-ink-muted">
                  Page {result.page} of {result.pageCount}
                </span>

                {result.page < result.pageCount ? (
                  <Link
                    href={hrefForPage(result.page + 1)}
                    className="rounded-full border border-border-input px-4 py-2 text-ink transition-colors hover:border-primary hover:text-primary"
                  >
                    Next
                  </Link>
                ) : (
                  <span className="rounded-full border border-border-input px-4 py-2 text-ink-muted opacity-50">
                    Next
                  </span>
                )}
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}
