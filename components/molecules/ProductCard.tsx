"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Badge, type BadgeVariantType } from "@/components/atoms/Badge";
import { cn, formatPrice } from "@/lib/utils";

export interface ProductCardImage {
  publicId: string;
  alt: string;
  blurDataUrl?: string;
}

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    priceCents: number;
    compareAtCents?: number;
    image?: ProductCardImage;
    badge?: "new" | "limited" | "sold-out" | "bestseller";
    rating?: { average: number; count: number };
  };
  variant?: "grid" | "carousel" | "compact";
  priority?: boolean;
  onQuickAdd?: (productId: string) => void;
}

const badgeLabel: Record<string, string> = {
  new: "New",
  limited: "Limited",
  "sold-out": "Sold Out",
  bestseller: "Bestseller",
};

export function ProductCard({ product, variant = "grid", priority = false, onQuickAdd }: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const isSoldOut = product.badge === "sold-out";
  const baseUrl = "https://res.cloudinary.com/cookie-and-crumbs/image/upload/f_auto,q_auto";

  const handleQuickAdd = () => {
    if (isSoldOut || !onQuickAdd) return;
    onQuickAdd(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className={cn("group relative flex flex-col", variant === "compact" && "max-w-[220px]")}>
      <div className="product-tile">
        <Link href={`/product/${product.slug}`} className="block relative" aria-label={product.name}>
          {product.image ? (
            <>
              <Image
                src={`${baseUrl}/w_${variant === "compact" ? 400 : 800},c_fill,g_auto/${product.image.publicId}`}
                alt={product.image.alt}
                width={variant === "compact" ? 400 : 800}
                height={variant === "compact" ? 400 : 800}
                loading={priority ? "eager" : "lazy"}
                className={cn(
                  "aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]",
                  isSoldOut && "opacity-50 saturate-50"
                )}
              />
            </>
          ) : (
            <div className="aspect-square w-full bg-muted" />
          )}
        </Link>

        {product.badge && !isSoldOut && (
          <Badge variant={product.badge as BadgeVariantType} className="absolute left-3 top-3 z-10">
            {badgeLabel[product.badge]}
          </Badge>
        )}
        {isSoldOut && (
          <Badge variant="soldout" className="absolute left-3 top-3 z-10">
            Sold Out
          </Badge>
        )}

        {onQuickAdd && !isSoldOut && (
          <Button
            size="sm"
            onClick={handleQuickAdd}
            className={cn(
              "absolute bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] transition-opacity duration-200",
              added ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
            )}
            aria-label={`Quick add ${product.name} to cart`}
          >
            {added ? "Added" : "Quick Add"}
          </Button>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <Link
          href={`/product/${product.slug}`}
          className={cn(
            "font-medium leading-snug hover:text-primary transition-colors",
            variant === "compact" ? "text-sm" : "text-base"
          )}
        >
          {product.name}
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="tabular-nums font-semibold">{formatPrice(product.priceCents)}</span>
            {product.compareAtCents && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtCents)}
              </span>
            )}
          </div>
          {product.rating && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground" aria-label={`Rated ${product.rating.average} out of 5`}>
              <Star className="w-4 h-4 fill-primary text-primary" aria-hidden="true" />
              <span className="tabular-nums">{product.rating.average.toFixed(1)}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}