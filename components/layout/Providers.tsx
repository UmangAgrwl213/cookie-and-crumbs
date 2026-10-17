"use client";

import { ReactNode, useState } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/lib/stores/cart";
import { ToastProvider } from "@/lib/hooks/use-toast";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const hasValidClerk =
  (clerkKey.startsWith("pk_test_") || clerkKey.startsWith("pk_live_")) &&
  !clerkKey.includes("placeholder");

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  const app = (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <CartProvider>{children}</CartProvider>
      </ToastProvider>
    </QueryClientProvider>
  );

  if (!hasValidClerk) return app;

  return (
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={{
        variables: { colorPrimary: "var(--burnt-sugar-500)" },
      }}
    >
      {app}
    </ClerkProvider>
  );
}