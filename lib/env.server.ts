import { z } from "zod";

const PLACEHOLDER = "placeholder";

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  CLERK_SECRET_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  ALGOLIA_APP_ID: z.string().min(1),
  ALGOLIA_API_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  EMAIL_FROM: z
    .string()
    .refine(
      (value) => {
        const match = /^(?:"?[^"<>]*"?\s*)?<([^<>\s@]+@[^<>\s@]+)>$/.exec(value.trim());
        return Boolean(match);
      },
      { message: "Must be a plain address or display name format (Cookie & Crumbs <orders@example.com>)" }
    ),
  SENTRY_DSN: z.string().url().optional(),
});

type ServerEnv = z.infer<typeof serverSchema>;

function loadEnv(): { env: ServerEnv; missing: string[]; invalid: string[] } {
  const raw: Record<string, string | undefined> = {
    DATABASE_URL: process.env.DATABASE_URL,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
    ALGOLIA_API_KEY: process.env.ALGOLIA_API_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,
    SENTRY_DSN: process.env.SENTRY_DSN,
  };

  const missing: string[] = [];
  const invalid: string[] = [];
  const env = {} as ServerEnv;

  for (const key of Object.keys(raw) as (keyof ServerEnv)[]) {
    const value = raw[key];
    const result = serverSchema.shape[key].safeParse(value);

    if (result.success) {
      env[key] = result.data as never;
      continue;
    }

    if (value === undefined || value === "") {
      missing.push(String(key));
    } else {
      invalid.push(String(key));
    }

    env[key] = (value ?? `${PLACEHOLDER}_${String(key)}`) as never;
  }

  return { env, missing, invalid };
}

const loaded = loadEnv();

if (loaded.missing.length > 0 && process.env.NODE_ENV === "production") {
  console.warn(
    `[env] Missing server environment variables: ${loaded.missing.join(", ")}. ` +
      "Affected integrations are disabled."
  );
}

if (loaded.invalid.length > 0) {
  console.warn(
    `[env] Invalid server environment variables: ${loaded.invalid.join(", ")}. ` +
      "Check the expected format for these values."
  );
}

export const serverEnv = loaded.env;
export const missingEnvKeys = loaded.missing;
export const invalidEnvKeys = loaded.invalid;
export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
