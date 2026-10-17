import { prisma } from "@/lib/prisma";

export interface PricedLine {
  productId: string;
  variantId?: string;
  quantity: number;
  config?: unknown;
}

/**
 * Recomputes authoritative unit prices for the given lines from the database.
 * A line resolves to `null` when the product is gone/inactive or the requested
 * variant no longer exists, so callers can reject stale carts instead of
 * trusting client-supplied totals.
 */
export async function revalidatePrices(items: PricedLine[]) {
  if (items.length === 0) return [];

  const productIds = [...new Set(items.map((i) => i.productId))];
  const variantIds = [...new Set(items.map((i) => i.variantId).filter((id): id is string => Boolean(id)))];

  const [products, variants] = await Promise.all([
    prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      select: { id: true, basePriceCents: true },
    }),
    variantIds.length > 0
      ? prisma.productVariant.findMany({
          where: { id: { in: variantIds }, inStock: true },
          select: { id: true, productId: true, priceCents: true },
        })
      : Promise.resolve([]),
  ]);

  const productPrices = new Map(products.map((p) => [p.id, p.basePriceCents]));
  const variantPrices = new Map(variants.map((v) => [v.id, { productId: v.productId, priceCents: v.priceCents }]));

  return items.map((item) => {
    if (!productPrices.has(item.productId)) {
      return { ...item, unitPriceCents: null };
    }

    if (item.variantId) {
      const variant = variantPrices.get(item.variantId);
      if (!variant || variant.productId !== item.productId) {
        return { ...item, unitPriceCents: null };
      }
      return { ...item, unitPriceCents: variant.priceCents };
    }

    return { ...item, unitPriceCents: productPrices.get(item.productId)! };
  });
}

export const FREE_SHIPPING_THRESHOLD_CENTS = 5000;

export function calculateShipping(subtotalCents: number): number {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : 600;
}
