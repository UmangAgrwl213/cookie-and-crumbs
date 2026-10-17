import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterProps {
  newsletterAction: string;
}

export function Footer({ newsletterAction }: FooterProps) {
  const navigation = {
    Shop: [
      { label: "All Cakes", href: "/category/cakes" },
      { label: "Pastries", href: "/category/pastries" },
      { label: "Cookies", href: "/category/cookies" },
      { label: "Seasonal", href: "/category/seasonal" },
      { label: "Gift Boxes", href: "/category/gifts" },
    ],
    Company: [
      { label: "Our Story", href: "/about" },
      { label: "Bakery Locations", href: "/locations" },
      { label: "Wholesale", href: "/wholesale" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
    Support: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Custom Orders", href: "/custom" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/cookieandcrumbs", label: "Instagram" },
    { icon: Facebook, href: "https://facebook.com/cookieandcrumbs", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/cookieandcrumbs", label: "Twitter" },
    { icon: Mail, href: "mailto:hello@cookieandcrumbs.com", label: "Email" },
  ];

  const contactInfo = [
    { icon: MapPin, text: "12 Bakers Lane, Your City, ST 00000" },
    { icon: Phone, text: "+1 (555) 123-4567" },
    { icon: Clock, text: "Mon–Fri 8am–6pm • Sat 9am–5pm • Sun Closed" },
  ];

  return (
    <footer className="border-t border-border bg-background" role="contentinfo">
      <div className="container-tight py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="font-display text-3xl font-medium" aria-label="Cookie & Crumbs home">
              Cookie & Crumbs
            </Link>
            <p className="text-muted-foreground max-w-xs">
              Artisanal baking, crafted with love. Small-batch cakes and pastries made from
              the finest ingredients since 2018.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(navigation).map(([title, links]) => (
            <nav key={title} aria-labelledby={`${title.toLowerCase()}-heading`}>
              <h3 id={`${title.toLowerCase()}-heading`} className="font-medium mb-4">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="font-medium">Stay in Touch</h3>
              <p className="text-sm text-muted-foreground">
                Get seasonal menus, baking tips, and exclusive offers.
              </p>
              <form action={newsletterAction} method="POST" className="flex gap-2 mt-4">
                <label htmlFor="email-footer" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  id="email-footer"
                  name="email"
                  placeholder="Enter your email"
                  required
                  className="flex-1 h-10 px-4 rounded-md border border-input bg-background text-sm focus-visible:ring-2"
                />
                <button type="submit" className="btn-luxury whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </div>

            <address className="space-y-3">
              <h3 className="font-medium">Visit Us</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {contactInfo.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <Icon className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </address>

            <div className="space-y-3">
              <h3 className="font-medium">Gift Cards</h3>
              <p className="text-sm text-muted-foreground">
                Perfect for any occasion. Delivered instantly via email.
              </p>
              <Link href="/gift-cards" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Buy a Gift Card
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Cookie & Crumbs. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Made with care</span>
            <span aria-hidden="true">·</span>
            <Link href="/accessibility" className="hover:text-foreground transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}