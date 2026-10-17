import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FilterSidebar } from "@/components/molecules/FilterSidebar";
import { ProductGrid } from "@/components/molecules/ProductGrid";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
  });

  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { isActive: true, categoryId: category.id },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      variants: { where: { inStock: true }, take: 1 },
    },
    orderBy: { isFeatured: "desc" },
    take: 24,
  });

  const facets = await prisma.productVariant.groupBy({
    by: ["flavor"],
    where: { product: { categoryId: category.id, isActive: true } },
  });

  const priceRange = await prisma.product.aggregate({
    where: { isActive: true, categoryId: category.id },
    _min: { basePriceCents: true },
    _max: { basePriceCents: true },
  });

  return (
    <div className="container-tight py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-medium">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-muted-foreground">{category.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <FilterSidebar
          facets={facets.map((f) => ({ flavor: f.flavor }))}
          priceRange={{
            min: priceRange._min.basePriceCents ?? 0,
            max: priceRange._max.basePriceCents ?? 0,
          }}
        />
        <ProductGrid
          initialProducts={products.map((p) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            priceCents: p.basePriceCents,
            image: p.images[0]
              ? { publicId: p.images[0].publicId, alt: p.images[0].alt }
              : undefined,
          }))}
        />
      </div>
    </div>
  );
}
