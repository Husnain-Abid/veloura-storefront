import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <CategoryGrid />
      <FeaturedProducts 
        title="New Arrivals" 
        subtitle="Fresh Trends" 
        type="new" 
      />
      
      {/* Editorial Section */}
      <section className="py-24 bg-[#1a1a1a] text-white overflow-hidden">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="aspect-[4/5] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
                alt="Editorial"
                className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white/10 backdrop-blur-md hidden md:flex items-center justify-center p-8 border border-white/20">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-center leading-relaxed">
                Est. 2024 <br /> Lahore, Pakistan
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-start max-w-xl">
            <span className="text-xs font-bold uppercase tracking-[0.4em] mb-6 text-gray-500">The Story</span>
            <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">Crafted for the Modern Woman</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              We believe that fashion is a form of self-expression. Our collections are designed to empower women to feel confident, elegant, and comfortable in their own skin. From high-street western wear to luxury intimates, every piece is crafted with meticulous attention to detail and quality.
            </p>
            <button className="text-xs font-bold uppercase tracking-widest py-4 px-10 border border-white hover:bg-white hover:text-black transition-all duration-500">
              Discover Our Story
            </button>
          </div>
        </div>
      </section>

      <FeaturedProducts 
        title="Best Sellers" 
        subtitle="Customer Favorites" 
        type="bestseller" 
      />

      {/* Brand Values */}
      <section className="py-24 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Premium Quality</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Handpicked fabrics and superior craftsmanship in every stitch.</p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Fast Delivery</h4>
              <p className="text-gray-500 text-sm leading-relaxed">We ship nationwide across Pakistan with reliable logistics partners.</p>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Exchange Only</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Hassle-free exchange policy within 7 days of purchase.</p>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProducts 
        title="Flash Sale" 
        subtitle="Limited Time" 
        type="sale" 
      />
    </div>
  );
}
