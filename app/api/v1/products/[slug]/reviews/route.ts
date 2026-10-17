import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/clerk";
import { prisma } from "@/lib/prisma";
import { createReviewSchema } from "@/lib/schemas/order";

type Params = Promise<{ slug: string }>;

export async function GET(_request: NextRequest, { params }: { params: Params }) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: { OR: [{ id: slug }, { slug }], isActive: true },
    select: { id: true },
  });
  if (!product) {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "Product not found" } }, { status: 404 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId: product.id, status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      rating: true,
      body: true,
      verifiedPurchase: true,
      createdAt: true,
      user: { select: { name: true } },
    },
  });

  const summary = await prisma.review.aggregate({
    where: { productId: product.id, status: "APPROVED" },
    _avg: { rating: true },
    _count: true,
  });

  return NextResponse.json({
    reviews: reviews.map((r) => ({ ...r, author: r.user.name ?? "Anonymous", user: undefined })),
    summary: { average: summary._avg.rating ?? 0, count: summary._count },
  });
}

export async function POST(request: NextRequest, { params }: { params: Params }) {
  const { slug } = await params;
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Sign in required" } }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "INVALID_BODY", message: "Invalid review", fields: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }

  const product = await prisma.product.findFirst({
    where: { OR: [{ id: slug }, { slug }], isActive: true },
    select: { id: true },
  });
  if (!product) {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "Product not found" } }, { status: 404 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return NextResponse.json({ error: { code: "NOT_FOUND", message: "Profile not found" } }, { status: 404 });
  }

  const review = await prisma.review.create({
    data: {
      productId: product.id,
      userId: user.id,
      rating: parsed.data.rating,
      body: parsed.data.body,
      images: parsed.data.images ?? [],
      status: "PENDING_MODERATION",
    },
    select: { id: true, status: true, createdAt: true },
  });

  return NextResponse.json(review, { status: 201 });
}
