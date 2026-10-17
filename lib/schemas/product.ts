import { z } from "zod";

export const imageSchema = z.object({
  publicId: z.string().min(1),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  blurDataUrl: z.string(),
});

export const productQuerySchema = z.object({
  category: z.string().optional(),
  flavor: z.string().optional(),
  occasion: z.string().optional(),
  priceMin: z.coerce.number().int().nonnegative().optional(),
  priceMax: z.coerce.number().int().nonnegative().optional(),
  sort: z.enum(["featured", "newest", "price_asc", "price_desc"]).default("featured"),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;

export const productCardSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  priceCents: z.number().int().nonnegative(),
  compareAtCents: z.number().int().nonnegative().optional(),
  image: imageSchema.optional(),
  badge: z.enum(["new", "limited", "sold-out", "bestseller"]).optional(),
  rating: z.object({ average: z.number(), count: z.number() }).optional(),
});

export const availabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});