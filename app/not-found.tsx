import Link from "next/link";
import { Button } from "@/components/atoms/Button";

export default function NotFound() {
  return (
    <div className="container-tight py-24 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">404</p>
      <h1 className="font-display text-4xl md:text-5xl font-medium mb-4">This page sold out</h1>
      <p className="mx-auto max-w-md text-muted-foreground mb-8">
        The page you are looking for is not on the menu. Try the current collection instead.
      </p>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <Link href="/category/all">Browse baked goods</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </div>
  );
}
