"use client";

import { ProductCard } from "@/components/molecules/ProductCard";

interface Product {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  image?: { publicId: string; alt: string };
}

interface ProductGridProps {
  initialProducts: Product[];
}

export function ProductGrid({ initialProducts }: ProductGridProps) {
  if (initialProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {initialProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
