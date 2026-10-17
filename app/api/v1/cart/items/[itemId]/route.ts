import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { getSessionId } from "@/lib/session";
import { updateCartItemSchema } from "@/lib/schemas/cart";
import { removeItem, updateItem } from "@/lib/services/cart";

type Params = Promise<{ itemId: string }>;

async function verifyCartOwnership(itemId: string, userId: string | null, sessionId: string | undefined) {
  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    select: { cartId: true, cart: { select: { userId: true, sessionId: true } } },
  });
  if (!cartItem) return false;
  if (userId && cartItem.cart.userId === userId) return true;
  if (sessionId && cartItem.cart.sessionId === sessionId) return true;
  return false;
}

export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  const { itemId } = await params;
  const userId = await getCurrentUserId();
  const sessionId = userId ? undefined : await getSessionId();

  if (!(await verifyCartOwnership(itemId, userId, sessionId))) {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "Cart item not found" } }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateCartItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "INVALID_BODY", message: "Invalid update", fields: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }

  try {
    await updateItem(itemId, parsed.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "Cart item not found" } }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Params }) {
  const { itemId } = await params;
  const userId = await getCurrentUserId();
  const sessionId = userId ? undefined : await getSessionId();

  if (!(await verifyCartOwnership(itemId, userId, sessionId))) {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "Cart item not found" } }, { status: 404 });
  }

  try {
    await removeItem(itemId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "Cart item not found" } }, { status: 404 });
  }
}
