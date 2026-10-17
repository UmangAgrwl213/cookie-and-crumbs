import { z } from "zod";

export const orderConfigSchema = z.object({
  size: z.enum(["petite", "standard", "grand"]),
  flavor: z.string().min(1).max(60),
  inscription: z.string().max(40).optional(),
  allergenAck: z.boolean().refine((v) => v, { message: "Allergen acknowledgment is required" }),
  deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "ISO date required"),
  giftWrap: z.boolean().optional(),
  giftNote: z.string().max(200).optional(),
});

export const addCartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().optional(),
  quantity: z.number().int().min(1).max(50).default(1),
  config: orderConfigSchema.optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1).max(50).optional(),
  config: orderConfigSchema.partial().optional(),
});

export const mergeCartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        quantity: z.number().int().min(1).max(50),
        config: orderConfigSchema.optional(),
      })
    )
    .max(100),
});