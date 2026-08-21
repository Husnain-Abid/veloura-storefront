import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ProductListing } from "@/components/product/ProductListing";
import { Suspense } from "react";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string, sort?: string, q?: string }> }) {
  const params = await searchParams;
  
  let conditions = [];
  if (params.category) {
    const cat = await db.query.categories.findFirst({
      where: eq(categories.slug, params.category),
    });
    if (cat) {
      conditions.push(eq(products.categoryId, cat.id));
    }
  }

  const allProducts = await db.select().from(products).where(and(...conditions));
  const allCategories = await db.select().from(categories);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-8">
        <a href="/" className="hover:text-black transition-colors">Home</a>
        <span>/</span>
        <span className="text-black">Shop</span>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-serif mb-4">The Collection</h1>
        <p className="text-gray-500 max-w-2xl leading-relaxed">
          Discover our curated selection of premium western wear and luxury intimates. 
          Every piece is designed with the modern woman in mind, combining style, 
          comfort, and uncompromising quality.
        </p>
      </div>

      <Suspense fallback={<div>Loading products...</div>}>
        <ProductListing products={allProducts} />
      </Suspense>
    </div>
  );
}
