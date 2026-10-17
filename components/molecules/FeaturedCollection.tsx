"use client";

import { ProductCard, type ProductCardImage } from "@/components/molecules/ProductCard";
import { SkeletonBlock } from "@/components/skeletons/SkeletonBlock";
import { Button } from "@/components/atoms/Button";
import { useProducts } from "@/lib/hooks/use-products";
import Link from "next/link";

interface FeaturedProduct {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  compareAtCents?: number;
  image?: ProductCardImage;
  badge?: "new" | "limited" | "sold-out" | "bestseller";
  rating?: { average: number; count: number };
}

const FALLBACK_PRODUCTS: FeaturedProduct[] = [
  {
    id: "demo-1",
    slug: "salted-caramel-financier-box",
    name: "Salted Caramel Financier, Box of 6",
    priceCents: 3400,
    badge: "bestseller",
    rating: { average: 4.8, count: 214 },
  },
  {
    id: "demo-2",
    slug: "dark-chocolate-raspberry-cake",
    name: "Dark Chocolate & Raspberry Layer Cake",
    priceCents: 6500,
  },
  {
    id: "demo-3",
    slug: "pistachio-croissant",
    name: "Pistachio Croissant",
    priceCents: 580,
    badge: "new",
    rating: { average: 4.9, count: 87 },
  },
  {
    id: "demo-4",
    slug: "birthday-party-cake",
    name: "Celebration Cake",
    priceCents: 7800,
    rating: { average: 4.7, count: 156 },
  },
];

export function FeaturedCollection() {
  const { data, isLoading, isError } = useProducts({ sort: "featured", limit: 8 });
  const products = data?.products ?? (isError ? FALLBACK_PRODUCTS : []);

  return (
    <section className="container-tight py-16 md:py-24" aria-labelledby="featured-heading">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-primary mb-2">From our ovens</p>
          <h2 id="featured-heading" className="font-display text-3xl md:text-4xl font-medium">
            Featured This Week
          </h2>
        </div>
        <Button asChild variant="outline">
          <Link href="/category/all">View All</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <SkeletonBlock width="100%" height={300} />
                <SkeletonBlock width="70%" height={16} className="!h-4" />
                <SkeletonBlock width="30%" height={14} className="!h-3.5" />
              </div>
            ))
          : products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}