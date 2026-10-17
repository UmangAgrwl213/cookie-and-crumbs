import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session";
import { addCartItemSchema } from "@/lib/schemas/cart";
import { addItem, getCart } from "@/lib/services/cart";

export async function GET() {
  const userId = await getCurrentUserId();
  const sessionId = userId ? undefined : await getOrCreateSessionId();
  const cart = await getCart(userId ?? null, sessionId);
  return NextResponse.json(cart);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = addCartItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "INVALID_BODY", message: "Invalid cart item", fields: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }

  const userId = await getCurrentUserId();
  const sessionId = userId ? undefined : await getOrCreateSessionId();

  try {
    const product = await prisma.product.findFirst({
      where: { id: parsed.data.productId, isActive: true },
      select: { id: true, variants: { where: { id: parsed.data.variantId }, select: { id: true, inStock: true } } },
    });
    if (!product) {
      return NextResponse.json({ error: { code: "NOT_FOUND", message: "Product not found" } }, { status: 404 });
    }
    if (parsed.data.variantId && product.variants.length === 0) {
      return NextResponse.json({ error: { code: "OUT_OF_STOCK", message: "Variant unavailable" } }, { status: 410 });
    }

    const cart = await getCart(userId ?? null, sessionId);
    if (!cart.cartId) {
      return NextResponse.json({ error: { code: "INTERNAL", message: "Could not create cart" } }, { status: 500 });
    }

    await addItem(cart.cartId, parsed.data);
    // Single re-fetch after addItem (not two calls)
    const updated = await getCart(userId ?? null, sessionId);
    return NextResponse.json(updated, { status: 201 });
  } catch {
    return NextResponse.json({ error: { code: "INTERNAL", message: "Failed to add item" } }, { status: 500 });
  }
}

