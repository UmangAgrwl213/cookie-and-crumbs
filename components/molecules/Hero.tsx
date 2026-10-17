"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/atoms/Button";

interface HeroProps {
  media: { publicId: string; alt: string };
  heading: string;
  subheading?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export function Hero({ media, heading, subheading, primaryCta, secondaryCta }: HeroProps) {
  const reduceMotion = useReducedMotion();

  const baseUrl = `https://res.cloudinary.com/cookie-and-crumbs/image/upload/f_auto,q_auto`;

  return (
    <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden" aria-label="Welcome to Cookie & Crumbs">
      <Image
        src={`${baseUrl}/w_1920,c_fill,g_auto/${media.publicId}`}
        alt={media.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/70 via-espresso-900/30 to-transparent" aria-hidden="true" />

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-medium text-shortbread-050 leading-tight tracking-tight"
          >
            {heading}
          </motion.h1>

          {subheading && (
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-lg md:text-xl text-shortbread-100/90 font-light"
            >
              {subheading}
            </motion.p>
          )}

          {(primaryCta || secondaryCta) && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
            >
              {primaryCta && (
                <Button asChild size="lg" className="bg-burnt-sugar-500 text-white hover:bg-burnt-sugar-700">
                  <a href={primaryCta.href}>{primaryCta.label}</a>
                </Button>
              )}
              {secondaryCta && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-shortbread-050 text-shortbread-050 hover:bg-shortbread-050/10 hover:border-shortbread-050 bg-transparent"
                >
                  <a href={secondaryCta.href}>{secondaryCta.label}</a>
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}