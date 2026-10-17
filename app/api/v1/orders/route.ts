import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/clerk";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { createOrderSchema } from "@/lib/schemas/order";
import { hasValidStripe, stripe } from "@/lib/stripe";
import { revalidatePrices, calculateShipping } from "@/lib/services/pricing";

export async function POST(request: Request) {
  const idempotencyKey = request.headers.get("Idempotency-Key");
  if (!idempotencyKey || idempotencyKey.length < 8) {
    return NextResponse.json(
      { error: { code: "MISSING_IDEMPOTENCY_KEY", message: "Idempotency-Key header required" } },
      { status: 400 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "INVALID_BODY", message: "Invalid order payload", fields: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Sign in required" } }, { status: 401 });
  }

  try {
    const existing = await prisma.order.findUnique({ where: { idempotencyKey } });
    if (existing) {
      return NextResponse.json(
        { orderId: existing.id, status: existing.status, clientSecret: null },
        { status: 200 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { id: parsed.data.cartId, userId },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, basePriceCents: true } },
            variant: { select: { id: true, priceCents: true } },
          },
        },
      },
    });
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: { code: "EMPTY_CART", message: "Cart is empty" } }, { status: 400 });
    }

    const validated = await revalidatePrices(
      cart.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId ?? undefined,
        quantity: item.quantity,
        config: item.config ?? undefined,
      }))
    );

    const stale = validated.find((v) => v.unitPriceCents === null);
    if (stale) {
      return NextResponse.json(
        { error: { code: "STALE_PRICE", message: "Some items have changed price or are no longer available" } },
        { status: 409 }
      );
    }

    const names = new Map(
      cart.items.map((item) => [`${item.productId}:${item.variantId ?? "none"}`, item.product.name])
    );

    const orderItems: Prisma.OrderItemCreateManyOrderInput[] = validated.map((item) => ({
      productId: item.productId,
      variantId: item.variantId ?? null,
      name: names.get(`${item.productId}:${item.variantId ?? "none"}`) ?? "Unknown Product",
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents!,
      config: (item.config as Prisma.InputJsonValue) ?? undefined,
    }));

    const subtotalCents = orderItems.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
    const shippingCents = calculateShipping(subtotalCents);
    const totalCents = subtotalCents + shippingCents;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        status: "PENDING_PAYMENT",
        subtotalCents,
        shippingCents,
        taxCents: 0,
        totalCents,
        shippingAddressId: parsed.data.shippingAddressId,
        billingAddressId: parsed.data.billingAddressId,
        deliveryMethod: parsed.data.deliveryMethod === "courier" ? "COURIER" : "PICKUP",
        idempotencyKey,
        items: { createMany: { data: orderItems } },
      },
    });

    let clientSecret: string | null = null;
    if (hasValidStripe) {
      const intent = await stripe.paymentIntents.create(
        {
          amount: totalCents,
          currency: "usd",
          payment_method: parsed.data.paymentMethodId,
          metadata: { orderId: order.id },
          automatic_payment_methods: { enabled: true },
        },
        { idempotencyKey }
      );
      clientSecret = intent.client_secret;
      await prisma.order.update({
        where: { id: order.id },
        data: { stripePaymentIntentId: intent.id },
      });
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return NextResponse.json(
      {
        orderId: order.id,
        status: order.status,
        clientSecret,
        totalCents,
        currency: "USD",
        estimatedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: { code: "INTERNAL", message: "Failed to create order" } }, { status: 500 });
  }
}

