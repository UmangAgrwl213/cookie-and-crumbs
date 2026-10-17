import type { MetadataRoute } from "next";

const STATIC_ROUTES = ["", "/about", "/contact", "/category/cakes", "/category/pastries", "/category/cookies", "/category/seasonal", "/category/gifts", "/faq", "/shipping", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const now = new Date();

  return STATIC_ROUTES.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}