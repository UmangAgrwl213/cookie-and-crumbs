"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface CartItem {
  itemId: string;
  productId: string;
  name: string;
  slug: string;
  quantity: number;
  unitPriceCents: number;
}

export function useCart() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/v1/cart");
      if (!res.ok) throw new Error("Failed to load cart");
      return res.json() as Promise<{ cartId: string | null; items: CartItem[]; subtotalCents: number }>;
    },
    staleTime: 30 * 1000,
  });

  const addItem = useMutation({
    mutationFn: async (input: { productId: string; quantity?: number; config?: unknown }) => {
      const res = await fetch("/api/v1/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: input.productId, quantity: input.quantity ?? 1, config: input.config }),
      });
      if (!res.ok) throw new Error("Failed to add item");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  return { ...query, addItem };
}