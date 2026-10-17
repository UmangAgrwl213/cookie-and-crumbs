"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-tight py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">Something went wrong</p>
      <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">The oven door is stuck</h1>
      <p className="mx-auto max-w-md text-muted-foreground mb-8">
        We could not load this page. Please try again, and if the problem continues we would love to hear from you.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" onClick={reset}>
          Try again
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
      {error.digest && (
        <p className="mt-8 text-xs text-muted-foreground">Reference: {error.digest}</p>
      )}
    </div>
  );
}
