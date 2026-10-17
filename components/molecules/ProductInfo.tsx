"use client";

import { useMemo, useState } from "react";
import { Check, Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { useCartStore } from "@/lib/stores/cart";
import { cn, formatPrice } from "@/lib/utils";

export interface ProductInfoVariant {
  id: string;
  name: string;
  flavor: string;
  priceCents: number;
  inStock: boolean;
}

export interface ProductInfoProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  basePriceCents: number;
  currency: string;
  leadTimeDays: number;
  variants: ProductInfoVariant[];
  image?: { publicId: string; alt: string };
}

interface ProductInfoProps {
  product: ProductInfoProduct;
  rating?: { average: number; count: number };
}

const SIZES = [
  { value: "petite", label: "Petite", note: "Serves 2-3" },
  { value: "standard", label: "Standard", note: "Serves 6-8" },
  { value: "grand", label: "Grand", note: "Serves 12-15" },
] as const;

type SizeValue = (typeof SIZES)[number]["value"];

function defaultDeliveryDate(leadTimeDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + Math.max(1, leadTimeDays));
  return date.toISOString().slice(0, 10);
}

export function ProductInfo({ product, rating }: ProductInfoProps) {
  const inStockVariants = useMemo(
    () => product.variants.filter((v) => v.inStock),
    [product.variants]
  );

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    inStockVariants[0]?.id
  );
  const [size, setSize] = useState<SizeValue>("standard");
  const [quantity, setQuantity] = useState(1);
  const [inscription, setInscription] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [allergenAck, setAllergenAck] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(() => defaultDeliveryDate(product.leadTimeDays));
  const [status, setStatus] = useState<"idle" | "saving" | "added" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const setCart = useCartStore((s) => s.setCart);
  const openCart = useCartStore((s) => s.openCart);
  const setSyncing = useCartStore((s) => s.setSyncing);

  const selectedVariant = inStockVariants.find((v) => v.id === selectedVariantId);
  const flavor = selectedVariant?.flavor ?? product.name;
  const priceCents = selectedVariant?.priceCents ?? product.basePriceCents;
  const soldOut = inStockVariants.length === 0;
  const minDate = defaultDeliveryDate(product.leadTimeDays);

  const toggleDetails = (key: string) =>
    setDetailsOpen((current) => (current === key ? null : key));

  const handleAddToCart = async () => {
    if (soldOut || !allergenAck) return;

    const config = {
      size,
      flavor,
      inscription: inscription.trim() || undefined,
      allergenAck: true,
      deliveryDate,
      giftWrap: giftWrap || undefined,
      giftNote: giftNote.trim() || undefined,
    };

    setStatus("saving");
    setError(null);
    setSyncing(true);

    addItem({
      productId: product.id,
      variantId: selectedVariantId,
      name: product.name,
      quantity,
      unitPriceCents: priceCents,
      image: product.image,
      config,
    });

    try {
      const response = await fetch("/api/v1/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariantId,
          quantity,
          config,
        }),
      });

      if (!response.ok) throw new Error("We could not add that to your cart.");

      const data = (await response.json()) as {
        cartId: string | null;
        items: Parameters<typeof setCart>[1];
      };
      if (data.cartId) setCart(data.cartId, data.items);

      setStatus("added");
      openCart();
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch (cause) {
      setStatus("error");
      setError(cause instanceof Error ? cause.message : "Something went wrong.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {rating && rating.count > 0 && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground tabular-nums">
              {rating.average.toFixed(1)}
            </span>{" "}
            from {rating.count} {rating.count === 1 ? "review" : "reviews"}
          </p>
        )}
        <h1 className="font-display text-4xl md:text-5xl font-medium leading-tight">
          {product.name}
        </h1>
        <p className="text-2xl font-semibold tabular-nums">{formatPrice(priceCents, product.currency)}</p>
        <p className="text-base leading-relaxed text-foreground/80">{product.description}</p>
      </div>

      {inStockVariants.length > 0 && (
        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-semibold mb-1">Flavor</legend>
          <div className="flex flex-wrap gap-2">
            {inStockVariants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantId(variant.id)}
                aria-pressed={variant.id === selectedVariantId}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  variant.id === selectedVariantId
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50 hover:bg-secondary"
                )}
              >
                {variant.flavor}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-semibold mb-1">Size</legend>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSize(option.value)}
              aria-pressed={size === option.value}
              className={cn(
                "rounded-md border px-3 py-3 text-left transition-colors",
                size === option.value
                  ? "border-primary bg-secondary"
                  : "border-border hover:border-primary/50"
              )}
            >
              <span className="block text-sm font-semibold">{option.label}</span>
              <span className="block text-xs text-muted-foreground">{option.note}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2">
        <label htmlFor="inscription" className="text-sm font-semibold">
          Inscription <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <input
          id="inscription"
          type="text"
          maxLength={40}
          value={inscription}
          onChange={(e) => setInscription(e.target.value)}
          placeholder="Hand-piped in white chocolate"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="text-xs text-muted-foreground">{40 - inscription.length} characters remaining</p>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="gift-wrap"
          type="checkbox"
          checked={giftWrap}
          onChange={(e) => setGiftWrap(e.target.checked)}
          className="h-4 w-4 rounded border-input accent-primary"
        />
        <label htmlFor="gift-wrap" className="text-sm font-medium">
          Add signature gift wrap (+$6)
        </label>
      </div>

      {giftWrap && (
        <textarea
          value={giftNote}
          onChange={(e) => setGiftNote(e.target.value)}
          maxLength={200}
          rows={3}
          placeholder="Gift note"
          aria-label="Gift note"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="delivery-date" className="text-sm font-semibold">
          Requested delivery date
        </label>
        <input
          id="delivery-date"
          type="date"
          min={minDate}
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Truck className="h-3.5 w-3.5" aria-hidden="true" />
          Baked to order. Allow {product.leadTimeDays} {product.leadTimeDays === 1 ? "day" : "days"}.
        </p>
      </div>

      <div className="flex items-start gap-2">
        <input
          id="allergen-ack"
          type="checkbox"
          checked={allergenAck}
          onChange={(e) => setAllergenAck(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-input accent-primary"
        />
        <label htmlFor="allergen-ack" className="text-sm text-foreground/80">
          I understand this bake contains wheat, dairy, eggs, and nuts.
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3 rounded-md border border-border">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="p-3 hover:bg-secondary transition-colors disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="tabular-nums w-6 text-center font-medium" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(50, q + 1))}
            className="p-3 hover:bg-secondary transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={soldOut || !allergenAck || status === "saving"}
          className="flex-1"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          {soldOut
            ? "Sold Out"
            : status === "added"
              ? "Added to Cart"
              : status === "saving"
                ? "Adding…"
                : "Add to Cart"}
        </Button>
      </div>

      {!allergenAck && !soldOut && (
        <p className="text-xs text-muted-foreground">
          Please acknowledge the allergen notice to continue.
        </p>
      )}

      {status === "error" && error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-2 flex flex-col divide-y divide-border border-y border-border">
        {[
          { key: "delivery", label: "Delivery & pickup", body: "Courier delivery across the metro area and pickup at our studio. Orders above $50 ship free." },
          { key: "ingredients", label: "Ingredients", body: "European butter, unbleached all-purpose flour, purecane sugar, and our own preserves. No artificial colors or preservatives." },
          { key: "care", label: "Storage", body: "Best enjoyed within 3 days. Store airtight at room temperature, or freeze for up to 30 days." },
        ].map((section) => (
          <div key={section.key}>
            <button
              type="button"
              onClick={() => toggleDetails(section.key)}
              aria-expanded={detailsOpen === section.key}
              className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold"
            >
              {section.label}
              <span aria-hidden="true">{detailsOpen === section.key ? "−" : "+"}</span>
            </button>
            {detailsOpen === section.key && (
              <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            )}
          </div>
        ))}
      </div>

      <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" aria-hidden="true" />
          Baked fresh to order
        </li>
        <li className="flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" aria-hidden="true" />
          Free delivery over $50
        </li>
      </ul>
    </div>
  );
}
