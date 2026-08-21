import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/product/ProductDetails";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await db.query.products.findFirst({
    where: eq(products.slug, slug),
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col w-full">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-12">
          <a href="/" className="hover:text-black transition-colors">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:text-black transition-colors">Shop</a>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </nav>

        <ProductDetails product={product} />
      </div>

      <div className="mt-24 bg-gray-50">
        <FeaturedProducts 
          title="Related Products" 
          subtitle="You May Also Like" 
          type="featured" 
        />
      </div>

      <div className="container mx-auto px-4 py-24">
         <h2 className="text-4xl font-serif text-center mb-12">Customer Reviews</h2>
         <div className="max-w-4xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-gray-100">
                <div className="text-center">
                    <span className="text-6xl font-serif block mb-2">{product.rating}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Average Rating</span>
                </div>
                <div className="md:col-span-2 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-4">
                            <span className="text-[10px] font-bold w-4">{star}</span>
                            <div className="flex-1 h-1 bg-gray-100">
                                <div 
                                    className="h-full bg-black" 
                                    style={{ width: star === 5 ? '80%' : star === 4 ? '15%' : '5%' }} 
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="space-y-8">
                {[1, 2].map((i) => (
                    <div key={i} className="pb-8 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs">
                                S
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-widest">Sarah Ahmed</h4>
                                <span className="text-[10px] text-gray-400 uppercase">Oct 12, 2024</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed italic">
                            "The quality is exceptional. It fits perfectly and the fabric feels very premium. Definitely buying more from here!"
                        </p>
                    </div>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
}
