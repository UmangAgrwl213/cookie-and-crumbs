import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getImageUrl } from "@/lib/cloudinary";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/product";
import { ProductInfo } from "@/components/molecules/ProductInfo";
import { RelatedProducts } from "@/components/molecules/RelatedProducts";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product || !product.isActive) {
    return { title: "Not found | Cookie & Crumbs" };
  }

  const image = product.images[0];

  return {
    title: `${product.name} | Cookie & Crumbs`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: image ? [{ url: getImageUrl(image.publicId, { width: 1200, height: 630, crop: "fill" }) }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product || !product.isActive) notFound();

  const [related, reviews] = await Promise.all([
    getRelatedProducts(product.id, product.categoryId, 4),
    prisma.review.findMany({
      where: { productId: product.id, status: "APPROVED" },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        rating: true,
        body: true,
        verifiedPurchase: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    }),
  ]);

  const ratingSummary = await prisma.review.aggregate({
    where: { productId: product.id, status: "APPROVED" },
    _avg: { rating: true },
    _count: true,
  });

  const primaryImage = product.images[0];

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-tight pt-6">
        <ol className="flex items-center gap-1 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            <Link
              href={`/category/${product.category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li aria-current="page" className="text-foreground font-medium truncate">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="container-tight py-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            {primaryImage ? (
              <div className="product-tile overflow-hidden">
                <Image
                  src={getImageUrl(primaryImage.publicId, { width: 1000, height: 1000, crop: "fill" })}
                  alt={primaryImage.alt}
                  width={1000}
                  height={1000}
                  priority
                  placeholder={primaryImage.blurDataUrl ? "blur" : "empty"}
                  blurDataURL={primaryImage.blurDataUrl || undefined}
                  className="aspect-square w-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-square w-full rounded-md bg-muted" />
            )}

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1).map((image) => (
                  <div key={image.id} className="product-tile overflow-hidden">
                    <Image
                      src={getImageUrl(image.publicId, { width: 300, height: 300, crop: "fill" })}
                      alt={image.alt}
                      width={300}
                      height={300}
                      className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <ProductInfo
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              description: product.description,
              basePriceCents: product.basePriceCents,
              currency: product.currency,
              leadTimeDays: product.leadTimeDays,
              variants: product.variants.map((v) => ({
                id: v.id,
                name: v.name,
                flavor: v.flavor,
                priceCents: v.priceCents,
                inStock: v.inStock,
              })),
              image: primaryImage
                ? { publicId: primaryImage.publicId, alt: primaryImage.alt }
                : undefined,
            }}
            rating={{
              average: ratingSummary._avg.rating ?? 0,
              count: ratingSummary._count,
            }}
          />
        </div>
      </div>

      {reviews.length > 0 && (
        <section className="container-tight pb-16" aria-labelledby="product-reviews-heading">
          <h2 id="product-reviews-heading" className="font-display text-2xl font-medium mb-6">
            What people say
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <figure key={review.id} className="rounded-xl border border-border bg-card p-6 flex flex-col gap-3">
                <div className="flex gap-1" aria-label={`Rated ${review.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={
                        index < review.rating
                          ? "h-4 w-4 fill-primary text-primary"
                          : "h-4 w-4 text-muted-foreground/40"
                      }
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-foreground/80 flex-1">
                  &ldquo;{review.body}&rdquo;
                </blockquote>
                <figcaption className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{review.user.name ?? "Anonymous"}</span>
                  {review.verifiedPurchase && (
                    <span className="text-xs font-medium text-green-700">✓ Verified</span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <RelatedProducts
        products={related.map((item) => {
          const image = item.images[0];
          return {
            id: item.id,
            slug: item.slug,
            name: item.name,
            priceCents: item.basePriceCents,
            image: image ? { publicId: image.publicId, alt: image.alt } : undefined,
          };
        })}
      />
    </>
  );
}
