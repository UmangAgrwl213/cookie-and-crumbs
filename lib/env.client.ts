import { z } from "zod";

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  NEXT_PUBLIC_ALGOLIA_APP_ID: z.string().optional(),
  NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY: z.string().optional(),
});

export const clientEnv = clientSchema.parse(process.env);
