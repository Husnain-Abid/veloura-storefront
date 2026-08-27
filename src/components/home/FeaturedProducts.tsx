import dbConnect from "@/lib/mongodb";
import { Product } from "@/models";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  type: "featured" | "new" | "bestseller" | "sale";
}

export const FeaturedProducts = async ({ title, subtitle, type }: FeaturedProductsProps) => {
  await dbConnect();
  
  let query: any = {};

  if (type === "featured") {
    query.isFeatured = true;
  } else if (type === "new") {
    query.isNewArrival = true;
  } else if (type === "bestseller") {
    query.isBestSeller = true;
  } else if (type === "sale") {
    query.isFlashSale = true;
  }

  const data = await Product.find(query).limit(4);

  const products = data.map(p => {
    const obj = p.toObject();
    obj.id = obj._id.toString();
    return obj;
  });

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
        {products.map((product) => (
          <ProductCard key={product.id} product={product as any} />
        ))}
      </div>
    </section>
  );
};
