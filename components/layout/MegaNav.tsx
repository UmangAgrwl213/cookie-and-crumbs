"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface MegaNavProps {
  categories: {
    slug: string;
    name: string;
    imagePublicId?: string;
  }[];
  activeCategory?: string;
}

export function MegaNav({ categories, activeCategory }: MegaNavProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const pathname = usePathname();

  return (
    <nav className="relative" role="navigation" aria-label="Main categories">
      <ul className="flex items-center gap-1 md:gap-6">
        {categories.map((category) => (
          <li key={category.slug} className="relative">
            <button
              onMouseEnter={() => setOpenCategory(category.slug)}
              onMouseLeave={() => setOpenCategory(null)}
              onFocus={() => setOpenCategory(category.slug)}
              onBlur={() => setTimeout(() => setOpenCategory(null), 100)}
              className={cn(
                "relative px-3 py-2 text-sm font-medium transition-colors duration-200",
                "hover:text-primary focus:outline-none focus-visible:ring-2",
                activeCategory === category.slug
                  ? "text-primary"
                  : "text-foreground/80 hover:text-foreground"
              )}
              aria-expanded={openCategory === category.slug}
              aria-haspopup="true"
            >
              {category.name}
            </button>

            {openCategory === category.slug && (
              <div
                className="absolute left-0 top-full z-50 w-72 md:w-96 rounded-xl border border-border bg-card shadow-lg p-4 animate-slide-in"
                role="menu"
                onMouseEnter={() => setOpenCategory(category.slug)}
                onMouseLeave={() => setOpenCategory(null)}
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="block px-3 py-2 text-sm font-semibold text-foreground hover:text-primary"
                  role="menuitem"
                >
                  View all {category.name}
                </Link>
                {category.imagePublicId && (
                  <div className="mt-3 aspect-square rounded-lg overflow-hidden">
                    <img
                      src={`https://res.cloudinary.com/cookie-and-crumbs/image/upload/f_auto,q_auto,w_400/${category.imagePublicId}`}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}