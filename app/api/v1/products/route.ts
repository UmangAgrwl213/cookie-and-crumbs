import { NextResponse } from "next/server";
import { productQuerySchema } from "@/lib/schemas/product";
import { getProducts } from "@/lib/services/product";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = productQuerySchema.safeParse(Object.fromEntries(searchParams));
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "INVALID_QUERY", message: "Invalid query parameters", fields: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }

  try {
    const result = await getProducts(parsed.data);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Failed to load products" } },
      { status: 500 }
    );
  }
}