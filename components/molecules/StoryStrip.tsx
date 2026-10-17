import Image from "next/image";
import { Button } from "@/components/atoms/Button";

export function StoryStrip() {
  const imageUrl = "https://res.cloudinary.com/cookie-and-crumbs/image/upload/f_auto,q_auto,w_1200,c_fill,g_auto/brand/bakery-story";

  return (
    <section className="bg-espresso-900 text-shortbread-050 py-16 md:py-24" aria-labelledby="story-heading">
      <div className="container-tight grid gap-10 md:grid-cols-2 md:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg order-2 md:order-1">
          <Image
            src={imageUrl}
            alt="Our bakers at work in the kitchen"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="order-1 md:order-2">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">
            Our Story
          </p>
          <h2 id="story-heading" className="font-display text-3xl md:text-4xl font-medium leading-snug">
            Small-batch baking, big on detail
          </h2>
          <p className="mt-5 text-shortbread-100/80 leading-relaxed max-w-prose">
            Every cake and pastry at Cookie & Crumbs is made the old-fashioned way — by hand,
            in small batches, with real butter, real chocolate, and seasonal fruit. No mixes,
            no shortcuts, no compromise.
          </p>
          <p className="mt-4 text-shortbread-100/80 leading-relaxed max-w-prose">
            From our signature layer cakes to the morning croissants, everything that leaves
            our kitchen is crafted to be the best part of someone&apos;s day.
          </p>
          <Button asChild variant="outline" className="mt-8 border-burntSugar-500 text-burntSugar-500 hover:bg-burntSugar-500 hover:text-espresso-900">
            <a href="/about">Read Our Story</a>
          </Button>
        </div>
      </div>
    </section>
  );
}