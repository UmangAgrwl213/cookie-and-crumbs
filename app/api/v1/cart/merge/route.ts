import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCurrentUserId } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/session";
import { mergeCartSchema } from "@/lib/schemas/cart";
import { cartInclude, serializeCart, stableStringify } from "@/lib/services/cart";
import { revalidatePrices } from "@/lib/services/pricing";

export async function POST(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Sign in required" } },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = mergeCartSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "INVALID_BODY", message: "Invalid cart payload" } },
      { status: 400 }
    );
  }

  const sessionId = await getSessionId();
  const guestCart = sessionId
    ? await prisma.cart.findUnique({ where: { sessionId }, include: { items: true } })
    : null;

  const userCart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: { items: true },
  });

  // Combine the client-provided lines with anything still stored on the guest
  // cart so nothing is lost when the guest cookie is cleared after sign-in.
  const requested = [
    ...parsed.data.items,
    ...(guestCart?.items ?? []).map((item) => ({
      productId: item.productId,
      variantId: item.variantId ?? undefined,
      quantity: item.quantity,
      config: item.config ?? undefined,
    })),
  ];

  const validated = await revalidatePrices(requested);
  const sellable = validated.filter((item) => item.unitPriceCents !== null);

  const existing = new Map<string, number>();
  for (const item of userCart.items) {
    const key = `${item.productId}:${item.variantId ?? "none"}:${stableStringify(item.config)}`;
    existing.set(key, (existing.get(key) ?? 0) + item.quantity);
  }

  const itemsToCreate: Prisma.CartItemCreateManyInput[] = [];
  const quantityUpdates: { id: string; quantity: number }[] = [];

  for (const item of sellable) {
    const key = `${item.productId}:${item.variantId ?? "none"}:${stableStringify(item.config)}`;
    const already = existing.get(key) ?? 0;
    if (already > 0) {
      const target = userCart.items.find(
        (existingItem) =>
          `${existingItem.productId}:${existingItem.variantId ?? "none"}:${stableStringify(existingItem.config)}` === key
      );
      if (target) quantityUpdates.push({ id: target.id, quantity: Math.min(50, target.quantity + item.quantity) });
      existing.set(key, already + item.quantity);
      continue;
    }

    existing.set(key, item.quantity);
    itemsToCreate.push({
      cartId: userCart.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: Math.min(50, item.quantity),
      config: (item.config as Prisma.InputJsonValue) ?? undefined,
    });
  }

  if (itemsToCreate.length > 0) {
    await prisma.cartItem.createMany({ data: itemsToCreate });
  }

  for (const update of quantityUpdates) {
    await prisma.cartItem.update({ where: { id: update.id }, data: { quantity: update.quantity } });
  }

  if (guestCart) {
    await prisma.cart.delete({ where: { id: guestCart.id } });
  }

  const freshCart = await prisma.cart.findUnique({
    where: { id: userCart.id },
    include: cartInclude,
  });

  return NextResponse.json(serializeCart(freshCart));
}
