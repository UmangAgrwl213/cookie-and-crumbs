"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/stores/cart";
import { MegaNav } from "./MegaNav";
import { AnnouncementBar } from "./AnnouncementBar";

interface HeaderProps {
  categories: {
    slug: string;
    name: string;
    imagePublicId?: string;
  }[];
  activeCategory?: string;
}

export function Header({ categories, activeCategory }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const openCart = useCartStore((s) => s.openCart);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <AnnouncementBar message="Seasonal lead time: 3–5 days for custom cakes. Order early!" />

      <div className="container-tight">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-md hover:bg-muted focus-visible:ring-2"
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>

            <Link href="/" className="font-display text-2xl font-medium tracking-tight" aria-label="Cookie & Crumbs home">
              Cookie & Crumbs
            </Link>

            <nav className="hidden md:block" aria-label="Main navigation">
              <MegaNav categories={categories} activeCategory={activeCategory} />
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 hover:bg-muted focus-visible:ring-2"
              aria-label="Search"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>

            <button
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 hover:bg-muted focus-visible:ring-2"
              aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ", empty"}`}
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </button>

            <Link
              href="/account"
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-md text-foreground/70 hover:bg-muted focus-visible:ring-2"
              aria-label="Account"
            >
              <User className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background animate-slide-down">
          <div className="container-tight py-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-md hover:bg-muted focus-visible:ring-2"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Mobile navigation">
              <ul className="space-y-1">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      className={cn(
                        "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        activeCategory === category.slug
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/80 hover:bg-muted"
                      )}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-background animate-fade-in md:hidden" role="dialog" aria-modal="true" aria-label="Search">
          <div className="container-tight pt-16 pb-8">
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 rounded-md hover:bg-muted focus-visible:ring-2"
                aria-label="Close search"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search cakes, pastries, cookies…"
                  className="w-full h-12 pl-12 pr-4 rounded-lg border border-input bg-background text-lg focus-visible:ring-2"
                  autoFocus
                  aria-label="Search products"
                />
              </div>
            </div>
            <p className="text-center text-muted-foreground">Search results would appear here (Algolia integration)</p>
          </div>
        </div>
      )}
    </header>
  );
}