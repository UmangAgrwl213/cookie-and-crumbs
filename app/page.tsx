import { Hero } from "@/components/molecules/Hero";
import { FeaturedCollection } from "@/components/molecules/FeaturedCollection";
import { StoryStrip } from "@/components/molecules/StoryStrip";
import { ReviewCarousel } from "@/components/molecules/ReviewCarousel";

const REVIEWS = [
  {
    author: "Mira S.",
    rating: 5 as const,
    body: "The salted caramel financiers are unreal — delicate crumb, not overly sweet, and they arrived perfectly fresh.",
    verifiedPurchase: true,
  },
  {
    author: "Daniel K.",
    rating: 5 as const,
    body: "Ordered a custom birthday cake for my wife. It looked even better than the photos and tasted incredible. Worth every penny.",
    verifiedPurchase: true,
  },
  {
    author: "Aisha R.",
    rating: 4 as const,
    body: "The pistachio croissants sell out for a reason. A little pricier than the corner bakery, but you can taste why.",
    verifiedPurchase: true,
  },
  {
    author: "Tomás G.",
    rating: 5 as const,
    body: "Delivery was on time, packaging was beautiful, and the dark chocolate raspberry cake was a showstopper.",
    verifiedPurchase: true,
  },
  {
    author: "Priya V.",
    rating: 5 as const,
    body: "Finally a bakery that takes dietary needs seriously — the nut-free options are genuinely delicious, not a consolation prize.",
    verifiedPurchase: true,
  },
  {
    author: "Lena W.",
    rating: 5 as const,
    body: "Bought a gift box for a friend's housewarming. The presentation alone stole the show. Will absolutely be ordering again.",
    verifiedPurchase: true,
  },
];

export default function HomePage() {
  return (
    <>
      <Hero
        media={{ publicId: "hero/signature-cake", alt: "Signature chocolate layer cake with fresh raspberries" }}
        heading="Cookie & Crumbs"
        subheading="Artisanal cakes, pastries, and cookies — crafted by hand, delivered with care."
        primaryCta={{ label: "Explore the Menu", href: "/category/all" }}
        secondaryCta={{ label: "Custom Cake Orders", href: "/custom" }}
      />
      <FeaturedCollection />
      <StoryStrip />
      <ReviewCarousel reviews={REVIEWS} />
    </>
  );
}