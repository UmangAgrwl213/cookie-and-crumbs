import type { Metadata, Viewport } from "next";
import { Fraunces, Work_Sans } from "next/font/google";
import { ReactNode } from "react";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/molecules/CartDrawer";
import { Toaster } from "@/components/atoms/Toaster";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Cookie & Crumbs | Artisanal Cakes & Pastries",
    template: "%s | Cookie & Crumbs",
  },
  description:
    "Handcrafted cakes, pastries, and cookies made with the finest ingredients. Custom cakes for every occasion.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Cookie & Crumbs",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Cookie & Crumbs" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF4EA" },
    { media: "(prefers-color-scheme: dark)", color: "#2A1B14" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const NAV_CATEGORIES: { slug: string; name: string }[] = [
  { slug: "cakes", name: "Cakes" },
  { slug: "pastries", name: "Pastries" },
  { slug: "cookies", name: "Cookies" },
  { slug: "seasonal", name: "Seasonal" },
  { slug: "gifts", name: "Gifts" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${workSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://js.stripe.com" />
        <link rel="preconnect" href="https://api.clerk.com" />
      </head>
      <body className="font-body antialiased">
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 btn-luxury"
          >
            Skip to main content
          </a>
          <Header categories={NAV_CATEGORIES} />
          <main id="main-content">{children}</main>
          <Footer newsletterAction="/api/newsletter" />
          <CartDrawer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}