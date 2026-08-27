import dbConnect from "@/lib/mongodb";
import { Product, Category } from "@/models";
import { ProductListing } from "@/components/product/ProductListing";
import { Suspense } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string, sort?: string, q?: string }> }) {
  await dbConnect();
  const params = await searchParams;
  
  let query: any = {};
  if (params.category) {
    const cat = await Category.findOne({ slug: params.category });
    if (cat) {
      query.categoryId = cat._id;
    }
  }

  const results = await Product.find(query);
  const allProducts = results.map(p => {
    const obj = p.toObject();
    obj.id = obj._id.toString();
    return obj;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-8">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
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
