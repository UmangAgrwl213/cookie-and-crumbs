import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type JsonInput = Prisma.InputJsonValue;

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
        .map(([k, v]) => [k, canonicalize(v)])
    );
  }
  return value;
}

/**
 * Deterministic JSON with sorted keys. Postgres `jsonb` does not preserve key
 * order, so string comparison of stored config would be unreliable without it.
 */
export function stableStringify(value: unknown): string {
  return JSON.stringify(canonicalize(value ?? null));
}

export const cartInclude = {
  items: {
    include: {
      product: { include: { images: { where: { isPrimary: true }, take: 1 } } },
      variant: { select: { id: true, name: true, flavor: true, priceCents: true } },
    },
    orderBy: { createdAt: "asc" as const },
  },
} satisfies Prisma.CartInclude;

type CartWithItems = Prisma.CartGetPayload<{ include: typeof cartInclude }>;

export interface SerializedCartItem {
  itemId: string;
  productId: string;
  name: string;
  slug: string;
  quantity: number;
  unitPriceCents: number;
  image?: { publicId: string; alt: string };
  config?: unknown;
}

export function serializeCart(cart: CartWithItems | null) {
  if (!cart) return { cartId: null, items: [], subtotalCents: 0, currency: "USD" };

  const items: SerializedCartItem[] = cart.items.map((item) => ({
    itemId: item.id,
    productId: item.productId,
    name: item.product.name,
    slug: item.product.slug,
    quantity: item.quantity,
    unitPriceCents: item.variant?.priceCents ?? item.product.basePriceCents,
    image: item.product.images[0]
      ? { publicId: item.product.images[0].publicId, alt: item.product.images[0].alt }
      : undefined,
    config: item.config ?? undefined,
  }));

  return {
    cartId: cart.id,
    items,
    subtotalCents: items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0),
    currency: "USD",
  };
}

export async function getCart(userId: string | null, sessionId?: string) {
  if (userId) {
    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: cartInclude,
    });
    return serializeCart(cart);
  }

  // Guest: generate a unique session ID if none provided
  const effectiveSessionId = sessionId ?? randomUUID();
  const cart = await prisma.cart.upsert({
    where: { sessionId: effectiveSessionId },
    update: {},
    create: { sessionId: effectiveSessionId },
    include: cartInclude,
  });
  return serializeCart(cart);
}

export async function addItem(
  cartId: string,
  input: { productId: string; variantId?: string; quantity: number; config?: unknown }
) {
  // Find candidate items in this cart matching product + variant
  const candidates = await prisma.cartItem.findMany({
    where: { cartId, productId: input.productId, variantId: input.variantId ?? null },
  });

  // Match by config equality (stable key order), since Prisma can't filter JSON equality reliably
  const match = candidates.find(
    (c) => stableStringify(c.config) === stableStringify(input.config)
  );

  if (match) {
    await prisma.cartItem.update({
      where: { id: match.id },
      data: { quantity: match.quantity + input.quantity },
    });
    return;
  }

  await prisma.cartItem.create({
    data: {
      cartId,
      productId: input.productId,
      variantId: input.variantId,
      quantity: input.quantity,
      config: (input.config as Prisma.InputJsonValue) ?? undefined,
    },
  });
}

export async function updateItem(itemId: string, data: { quantity?: number; config?: unknown }) {
  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: data.quantity, config: data.config !== undefined ? (data.config as Prisma.InputJsonValue) : undefined },
  });
}

export async function removeItem(itemId: string) {
  await prisma.cartItem.delete({ where: { id: itemId } });
}
