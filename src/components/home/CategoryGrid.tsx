import Link from "next/link";
import { motion } from "framer-motion";

const CATEGORIES = [
  {
    name: "Western Wear",
    slug: "western-wear",
    image: "https://images.unsplash.com/photo-1539109132374-348218a1f2ad?q=80&w=800&auto=format&fit=crop",
    gridSpan: "md:col-span-2 md:row-span-2",
  },
  {
    name: "Intimates",
    slug: "undergarments",
    image: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=800&auto=format&fit=crop",
    gridSpan: "md:col-span-1 md:row-span-1",
  },
  {
    name: "New Arrivals",
    slug: "new-arrivals",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
    gridSpan: "md:col-span-1 md:row-span-1",
  },
];

export const CategoryGrid = () => {
  return (
    <section className="py-24 container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 block">Categories</span>
          <h2 className="text-4xl md:text-5xl font-serif">Curated Collections</h2>
        </div>
        <Link href="/shop" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1">
          View All Collections
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-[1000px] md:h-[700px]">
        {CATEGORIES.map((cat, idx) => (
          <Link 
            key={cat.slug} 
            href={`/shop?category=${cat.slug}`}
            className={`group relative overflow-hidden ${cat.gridSpan}`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${cat.image})` }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end">
              <h3 className="text-white text-2xl md:text-3xl font-serif mb-2">{cat.name}</h3>
              <span className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                Explore Now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
