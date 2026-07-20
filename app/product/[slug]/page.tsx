import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/product/product-detail";
import { getPublishedProductBySlug } from "@/lib/services/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (!product) {
    // Generic on purpose — a hidden/unpublished product must never be
    // distinguishable from a genuinely nonexistent slug via metadata.
    return {
      title: "Product Not Found",
      description: "This product is not available.",
    };
  }

  const title = product.website_title || product.name;
  const description =
    product.website_description || product.description || `Shop ${title} at Moosiva Lux Wear.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.image ? [{ url: product.image.url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getPublishedProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
