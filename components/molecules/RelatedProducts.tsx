import { ProductCard, type ProductCardImage } from "@/components/molecules/ProductCard";

export interface RelatedProduct {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  image?: ProductCardImage;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
  title?: string;
}

export function RelatedProducts({ products, title = "You may also love" }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="container-tight py-16 md:py-24" aria-labelledby="related-heading">
      <h2 id="related-heading" className="font-display text-3xl md:text-4xl font-medium mb-8">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
