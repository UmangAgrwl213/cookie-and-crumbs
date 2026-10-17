import { z } from "zod";

export const addressSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(100),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(2),
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/),
  country: z.string().length(2).default("US"),
});

export const createOrderSchema = z.object({
  cartId: z.string().min(1),
  shippingAddressId: z.string().min(1),
  billingAddressId: z.string().min(1),
  paymentMethodId: z.string().min(1),
  deliveryMethod: z.enum(["courier", "pickup"]).default("courier"),
  idempotencyKey: z.string().min(8).max(64),
});

export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  body: z.string().min(10).max(2000),
  images: z.array(z.string()).max(4).optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  dietaryPreferences: z.array(z.string()).max(10).optional(),
  marketingOptIn: z.boolean().optional(),
});