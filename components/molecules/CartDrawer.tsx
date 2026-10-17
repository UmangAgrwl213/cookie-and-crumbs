"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { SkeletonBlock } from "@/components/skeletons/SkeletonBlock";
import { useCartStore } from "@/lib/stores/cart";
import { cn, formatPrice } from "@/lib/utils";

interface CartDrawerProps {
  freeShippingThresholdCents?: number;
}

const FREE_SHIPPING_THRESHOLD = 5000;

export function CartDrawer({ freeShippingThresholdCents = FREE_SHIPPING_THRESHOLD }: CartDrawerProps) {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotalCents,
    isSyncing,
  } = useCartStore();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const progress = Math.min(100, (subtotalCents() / freeShippingThresholdCents) * 100);
  const remaining = freeShippingThresholdCents - subtotalCents();
  const count = items.length;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button
        className="absolute inset-0 bg-black/40 animate-fade-in"
        onClick={closeCart}
        tabIndex={-1}
        aria-label="Close cart"
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl flex flex-col animate-slide-left">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="font-display text-xl font-medium">Your Cart</h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-md hover:bg-secondary transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {isSyncing && (
          <div className="px-6 py-3 border-b border-border bg-secondary/50 text-sm text-muted-foreground">
            Syncing your cart…
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {count === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/40" aria-hidden="true" />
              <p className="text-muted-foreground">Your cart is empty.</p>
              <Button asChild variant="outline">
                <Link href="/category/all">Browse Baked Goods</Link>
              </Button>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {items.map((item) => (
                <li key={item.itemId} className="flex gap-4 animate-fade-in">
                  {item.image ? (
                    <Image
                      src={`https://res.cloudinary.com/cookie-and-crumbs/image/upload/f_auto,q_auto,w_200/${item.image.publicId}`}
                      alt={item.image.alt}
                      width={80}
                      height={80}
                      className="rounded-md object-cover w-20 h-20 shrink-0"
                    />
                  ) : (
                    <SkeletonBlock width={80} height={80} className="rounded-md shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/product/${item.productId}`}
                          className="font-medium text-sm line-clamp-2 hover:text-primary"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-muted-foreground tabular-nums">
                          {formatPrice(item.unitPriceCents)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.itemId)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                        className="p-1 rounded border border-border hover:bg-secondary transition-colors disabled:opacity-40"
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <span className="tabular-nums text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                        className="p-1 rounded border border-border hover:bg-secondary transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {count > 0 && (
          <div className="border-t border-border px-6 py-4">
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">
                  {remaining > 0 ? (
                    <>Add {formatPrice(remaining)} for free delivery</>
                  ) : (
                    <span className="text-green-700 font-medium">You&apos;ve unlocked free delivery</span>
                  )}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn("h-full rounded-full bg-primary transition-all duration-500")}
                  style={{ width: `${progress}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold tabular-nums">{formatPrice(subtotalCents())}</span>
            </div>
            <Button asChild className="w-full" size="lg">
              <Link href="/checkout">Checkout</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}