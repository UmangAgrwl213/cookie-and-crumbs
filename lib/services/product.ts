import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ProductQuery } from "@/lib/schemas/product";

const cardInclude = {
  images: {
    where: { isPrimary: true },
    take: 1,
  },
  variants: { where: { inStock: true }, orderBy: { sortOrder: "asc" as const } },
} satisfies Prisma.ProductInclude;

export type ProductCardRecord = Prisma.ProductGetPayload<{ include: typeof cardInclude }>;

function toCard(product: ProductCardRecord) {
  const image = product.images[0];
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    priceCents: product.basePriceCents,
    image: image ? { publicId: image.publicId, alt: image.alt } : undefined,
    badge: (!product.isFeatured && product.sortOrder === 0 && product.isActive
      ? ("new" as const)
      : undefined),
  };
}

export async function getProducts(query: ProductQuery) {
  const { category, sort, cursor, limit, priceMin, priceMax } = query;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (category && category !== "all") {
    where.category = { slug: category };
  }
  if (priceMin !== undefined || priceMax !== undefined) {
    where.basePriceCents = {};
    if (priceMin !== undefined) where.basePriceCents.gte = priceMin;
    if (priceMax !== undefined) where.basePriceCents.lte = priceMax;
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price_asc"
      ? { basePriceCents: "asc" }
      : sort === "price_desc"
        ? { basePriceCents: "desc" }
        : sort === "newest"
          ? { createdAt: "desc" }
          : { isFeatured: "desc" };

  const products = await prisma.product.findMany({
    where,
    include: cardInclude,
    orderBy,
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  const hasMore = products.length > limit;
  const page = hasMore ? products.slice(0, limit) : products;

  return {
    products: page.map(toCard),
    nextCursor: hasMore ? page[page.length - 1]?.id ?? null : null,
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
    },
  });
  return product;
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4) {
  return prisma.product.findMany({
    where: { isActive: true, categoryId, id: { not: productId } },
    include: cardInclude,
    take: limit,
  });
}