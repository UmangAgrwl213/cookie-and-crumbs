import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    slug: "cookies",
    name: "Cookies",
    description: "Baked each morning, best within three days.",
    imagePublicId: "cookie-and-crumbs/cookies",
    sortOrder: 0,
  },
  {
    slug: "cakes",
    name: "Cakes",
    description: "Celebration cakes, always made to order.",
    imagePublicId: "cookie-and-crumbs/cakes",
    sortOrder: 1,
  },
  {
    slug: "pastries",
    name: "Pastries",
    description: "Laminated, filled, and sold out by early afternoon.",
    imagePublicId: "cookie-and-crumbs/pastries",
    sortOrder: 2,
  },
  {
    slug: "preserves",
    name: "Preserves",
    description: "Small-batch fruit preserves made with whole fruit.",
    imagePublicId: "cookie-and-crumbs/preserves",
    sortOrder: 3,
  },
  {
    slug: "gift-boxes",
    name: "Gift Boxes",
    description: "Curated assortions for birthdays, weddings, and apologies.",
    imagePublicId: "cookie-and-crumbs/gift-boxes",
    sortOrder: 4,
  },
];

const products = [
  {
    categorySlug: "cookies",
    slug: "classic-chocolate-chip",
    name: "Classic Chocolate Chip",
    description:
      "The one we are known for. European butter, brown sugar, and a generous amount of dark chocolate, rested for 36 hours so the centre stays molten.",
    basePriceCents: 480,
    leadTimeDays: 1,
    isFeatured: true,
    sortOrder: 0,
    variants: [
      { name: "Single", flavor: "Dark Chocolate", priceCents: 480, sortOrder: 0 },
      { name: "Dozen", flavor: "Dark Chocolate", priceCents: 5200, sortOrder: 1 },
    ],
  },
  {
    categorySlug: "cookies",
    slug: "brown-butter-toffee",
    name: "Brown Butter Toffee",
    description:
      "Browned butter carries a deeper caramel note, balanced with crisp toffee shards and a pinch of flaky salt.",
    basePriceCents: 520,
    leadTimeDays: 1,
    isFeatured: true,
    sortOrder: 1,
    variants: [
      { name: "Single", flavor: "Toffee", priceCents: 520, sortOrder: 0 },
      { name: "Dozen", flavor: "Toffee", priceCents: 5600, sortOrder: 1 },
    ],
  },
  {
    categorySlug: "cookies",
    slug: "pistachio-rose",
    name: "Pistachio & Rose",
    description:
      "Pistachio cream folded through a soft dough, finished with a few drops of rosewater and crushed pistachio.",
    basePriceCents: 560,
    leadTimeDays: 1,
    isFeatured: false,
    sortOrder: 2,
    variants: [
      { name: "Single", flavor: "Pistachio", priceCents: 560, sortOrder: 0 },
      { name: "Dozen", flavor: "Pistachio", priceCents: 6000, sortOrder: 1 },
    ],
  },
  {
    categorySlug: "cakes",
    slug: "burnt-sugar-cheesecake",
    name: "Burnt Sugar Cheesecake",
    description:
      "A Basque-style cheesecake set on a burnt sugar base, with a hard caramel top and no graham cracker in sight.",
    basePriceCents: 6500,
    leadTimeDays: 2,
    isFeatured: true,
    sortOrder: 0,
    variants: [
      { name: "6 inch", flavor: "Burnt Sugar", priceCents: 6500, sortOrder: 0 },
      { name: "9 inch", flavor: "Burnt Sugar", priceCents: 9200, sortOrder: 1 },
    ],
  },
  {
    categorySlug: "cakes",
    slug: "espresso-tiramisu",
    name: "Espresso Tiramisu",
    description:
      "Espresso-soaked ladyfingers layered with mascarpone cream, dusted with cocoa hours before it reaches you.",
    basePriceCents: 7200,
    leadTimeDays: 2,
    isFeatured: true,
    sortOrder: 1,
    variants: [
      { name: "6 inch", flavor: "Espresso", priceCents: 7200, sortOrder: 0 },
      { name: "9 inch", flavor: "Espresso", priceCents: 10200, sortOrder: 1 },
    ],
  },
  {
    categorySlug: "pastries",
    slug: "morning-bun",
    name: "Morning Bun",
    description:
      "Croissant dough rolled with cinnamon sugar and baked in a honeycomb mould until the edges caramelise.",
    basePriceCents: 550,
    leadTimeDays: 1,
    isFeatured: true,
    sortOrder: 0,
    variants: [{ name: "Regular", flavor: "Cinnamon", priceCents: 550, sortOrder: 0 }],
  },
  {
    categorySlug: "pastries",
    slug: "preserve-danish",
    name: "Preserve Danish",
    description:
      "Laminated pastry filled with our own seasonal preserve and finished with cream cheese icing.",
    basePriceCents: 620,
    leadTimeDays: 1,
    isFeatured: false,
    sortOrder: 1,
    variants: [{ name: "Regular", flavor: "Preserve Red", priceCents: 620, sortOrder: 0 }],
  },
  {
    categorySlug: "preserves",
    slug: "strawberry-preserve",
    name: "Strawberry Preserve",
    description:
      "Whole strawberries cooked gently with lemon and cane sugar. Tends and pips intact.",
    basePriceCents: 1400,
    leadTimeDays: 1,
    isFeatured: false,
    sortOrder: 0,
    variants: [{ name: "8 oz jar", flavor: "Strawberry", priceCents: 1400, sortOrder: 0 }],
  },
  {
    categorySlug: "preserves",
    slug: "apricot-preserve",
    name: "Apricot Preserve",
    description: "Late-season apricots with a splash of vanilla and no pectin.",
    basePriceCents: 1400,
    leadTimeDays: 1,
    isFeatured: false,
    sortOrder: 1,
    variants: [{ name: "8 oz jar", flavor: "Apricot", priceCents: 1400, sortOrder: 0 }],
  },
  {
    categorySlug: "gift-boxes",
    slug: "signature-gift-box",
    name: "Signature Gift Box",
    description:
      "Twelve cookies, four morning buns, and a jar of preserve, packed in a keepsake box with a handwritten card.",
    basePriceCents: 9500,
    leadTimeDays: 3,
    isFeatured: true,
    sortOrder: 0,
    variants: [
      { name: "Serves 6", flavor: "Baker's Choice", priceCents: 9500, sortOrder: 0 },
      { name: "Serves 12", flavor: "Baker's Choice", priceCents: 16500, sortOrder: 1 },
    ],
  },
];

function blurPlaceholder() {
  return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjJlMWQwIi8+PC9zdmc+";
}

async function main() {
  const categoryIds = new Map();

  for (const category of categories) {
    const record = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        imagePublicId: category.imagePublicId,
        sortOrder: category.sortOrder,
      },
      create: category,
    });
    categoryIds.set(category.slug, record.id);
  }

  for (const product of products) {
    const categoryId = categoryIds.get(product.categorySlug);
    if (!categoryId) throw new Error(`Unknown category: ${product.categorySlug}`);

    const { categorySlug, variants, ...productData } = product;

    const record = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: productData.name,
        description: productData.description,
        basePriceCents: productData.basePriceCents,
        categoryId,
        leadTimeDays: productData.leadTimeDays,
        isFeatured: productData.isFeatured,
        sortOrder: productData.sortOrder,
      },
      create: { ...productData, categoryId },
    });

    await prisma.productVariant.deleteMany({ where: { productId: record.id } });
    await prisma.product.createMany({
      data: variants.map((variant) => ({ ...variant, productId: record.id })),
    });

    await prisma.productImage.deleteMany({ where: { productId: record.id } });
    await prisma.productImage.create({
      data: {
        productId: record.id,
        publicId: `cookie-and-crumbs/products/${product.slug}`,
        alt: productData.name,
        width: 1200,
        height: 1200,
        blurDataUrl: blurPlaceholder(),
        isPrimary: true,
        sortOrder: 0,
      },
    });
  }

  const [categoryCount, productCount, variantCount] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
    prisma.productVariant.count(),
  ]);

  console.log(
    `Seeded ${categoryCount} categories, ${productCount} products, ${variantCount} variants.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
