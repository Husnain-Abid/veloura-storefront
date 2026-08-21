import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  type: "featured" | "new" | "bestseller" | "sale";
}

export const FeaturedProducts = async ({ title, subtitle, type }: FeaturedProductsProps) => {
  let conditions = [];

  if (type === "featured") {
    conditions.push(eq(products.isFeatured, true));
  } else if (type === "new") {
    conditions.push(eq(products.isNewArrival, true));
  } else if (type === "bestseller") {
    conditions.push(eq(products.isBestSeller, true));
  } else if (type === "sale") {
    conditions.push(eq(products.isFlashSale, true));
  }

  const data = await db.select().from(products)
    .where(and(...conditions))
    .limit(4)
    .offset(0);

  return (
    <section className="py-24 container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          {subtitle && (
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">
              {subtitle}
            </span>
          )}
          <h2 className="text-4xl md:text-5xl font-serif">{title}</h2>
        </div>
        <Link href="/shop" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1">
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {data.map((product) => (
          <ProductCard key={product.id} product={product as any} />
        ))}
      </div>
    </section>
  );
};
