import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

/**
 * Clerk is only active when a real publishable key is configured. Without this
 * guard, `auth()` throws ("Clerk can't detect usage of clerkMiddleware()")
 * because the middleware degrades to a no-op.
 */
export const hasValidClerk =
  (clerkKey.startsWith("pk_test_") || clerkKey.startsWith("pk_live_")) &&
  !clerkKey.includes("placeholder");

/** Returns the signed-in Clerk user id, or null for guests / unconfigured Clerk. */
export async function getCurrentUserId(): Promise<string | null> {
  if (!hasValidClerk) return null;
  try {
    const { userId } = await auth();
    return userId ?? null;
  } catch {
    return null;
  }
}

export async function requireAuth(): Promise<string> {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/sign-in");
  return userId;
}

export async function getUserProfile(userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress ?? "",
    name: [user.firstName, user.lastName].filter(Boolean).join(" ") || null,
    imageUrl: user.imageUrl,
  };
}
