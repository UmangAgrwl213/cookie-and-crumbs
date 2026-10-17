"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  verifiedPurchase?: boolean;
  createdAt?: string;
}

interface ReviewCarouselProps {
  reviews: Review[];
}

export function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const [active, setActive] = useState(0);
  const pages = Math.max(1, Math.ceil(reviews.length / 3));

  const visible = reviews.slice(active * 3, active * 3 + 3);

  const prev = () => setActive((i) => (i - 1 + pages) % pages);
  const next = () => setActive((i) => (i + 1) % pages);

  return (
    <section className="container-tight py-16 md:py-24" aria-labelledby="reviews-heading">
      <div className="text-center mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-primary mb-2">Kind words</p>
        <h2 id="reviews-heading" className="font-display text-3xl md:text-4xl font-medium">
          Loved by our customers
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {visible.map((review, i) => (
          <figure
            key={`${review.author}-${i}`}
            className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4"
          >
            <div className="flex gap-1" aria-label={`Rated ${review.rating} out of 5`}>
              {Array.from({ length: 5 }).map((_, s) => (
                <Star
                  key={s}
                  className={cn("w-4 h-4", s < review.rating ? "fill-primary text-primary" : "text-muted-foreground/40")}
                  aria-hidden="true"
                />
              ))}
            </div>
            <blockquote className="text-sm leading-relaxed text-foreground/80 flex-1">
              &ldquo;{review.body}&rdquo;
            </blockquote>
            <figcaption className="flex items-center justify-between text-sm">
              <span className="font-semibold">{review.author}</span>
              {review.verifiedPurchase && (
                <span className="text-xs text-green-700 font-medium">✓ Verified purchase</span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      {reviews.length > 3 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="p-2 rounded-full border border-border hover:bg-secondary transition-colors disabled:opacity-50"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <div className="flex gap-2" aria-hidden="true">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i === active ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Show review page ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="p-2 rounded-full border border-border hover:bg-secondary transition-colors disabled:opacity-50"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}