import { NextRequest, NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const hasValidClerk =
  (clerkKey.startsWith("pk_test_") || clerkKey.startsWith("pk_live_")) &&
  !clerkKey.includes("placeholder");

const isPublicRoute = createRouteMatcher([
  "/",
  "/category(.*)",
  "/product(.*)",
  "/about",
  "/contact",
  "/blog(.*)",
  "/faq",
  "/privacy",
  "/terms",
  "/api/webhooks(.*)",
]);

/**
 * When no valid Clerk key is configured (e.g. scaffolded dev environment),
 * ship a no-op middleware instead of Clerk's — Clerk's wrapper validates the
 * publishable key before any inner guard can run, which would 500 every route.
 */
const middleware = hasValidClerk
  ? clerkMiddleware(async (auth, req) => {
      if (createRouteMatcher(["/api/webhooks(.*)"])(req)) return NextResponse.next();
      if (!isPublicRoute(req)) await auth.protect();
    })
  : (_req: NextRequest) => NextResponse.next();

export default middleware;

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
