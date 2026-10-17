"use client";

import { useQuery } from "@tanstack/react-query";

interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  image?: { publicId: string; alt: string };
}

export function useProducts(query: Record<string, string | number | undefined>) {
  return useQuery({
    queryKey: ["products", query],
    queryFn: async () => {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) params.set(key, String(value));
      }
      const res = await fetch(`/api/v1/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load products");
      return res.json() as Promise<{ products: ProductCardData[]; nextCursor: string | null }>;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await fetch(`/api/v1/products/${slug}`);
      if (!res.ok) throw new Error("Product not found");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}