import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/services/product";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);
    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Product not found" } },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Failed to load product" } },
      { status: 500 }
    );
  }
}