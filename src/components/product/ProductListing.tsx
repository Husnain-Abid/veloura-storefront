"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { 
  ChevronDown, 
  SlidersHorizontal, 
  X,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: any[];
}

export const ProductListing = ({ products: initialProducts }: ProductGridProps) => {
  const [products, setProducts] = useState(initialProducts);
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    return Array.from(new Set(initialProducts.map((p) => p.categoryId)));
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (searchQuery) {
      result = result.filter((p) => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCategory) {
      result = result.filter((p) => p.categoryId === filterCategory);
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "bestseller") {
      result = result.filter(p => p.isBestSeller);
    }

    return result;
  }, [initialProducts, searchQuery, filterCategory, sortBy]);

  return (
    <div className="flex flex-col gap-8">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100 pb-8">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-black px-6 py-3 hover:bg-black hover:text-white transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs border border-gray-200 focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
            Showing {filteredProducts.length} Products
          </span>
          <div className="relative group flex-1 md:flex-none">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-48 appearance-none bg-white border border-gray-200 px-4 py-3 text-xs font-bold uppercase tracking-widest focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="bestseller">Best Selling</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-gray-500 uppercase tracking-widest text-sm">No products found.</p>
          <button 
            onClick={() => {
              setSearchQuery("");
              setFilterCategory(null);
            }}
            className="mt-4 text-xs font-bold uppercase tracking-widest border-b border-black pb-1"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[100]"
              onClick={() => setIsFilterOpen(false)}
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[90%] max-w-sm bg-white z-[110] p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold uppercase tracking-tighter">Filters</span>
                <button onClick={() => setIsFilterOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-8">
                {/* Category Filter */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((catId: any) => (
                      <button
                        key={catId}
                        onClick={() => setFilterCategory(catId === filterCategory ? null : catId)}
                        className={cn(
                          "px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all",
                          filterCategory === catId ? "bg-black text-white border-black" : "bg-white text-black border-gray-200"
                        )}
                      >
                        {catId ? "Category Item" : "All"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter (Dummy) */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Price Range</h4>
                  <div className="space-y-2">
                    {["PKR 0 - 2500", "PKR 2500 - 5000", "PKR 5000+"].map((range) => (
                      <label key={range} className="flex items-center gap-3 cursor-pointer group">
                        <div className="w-4 h-4 border border-gray-300 group-hover:border-black transition-colors" />
                        <span className="text-xs uppercase tracking-widest text-gray-600">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Size Filter (Dummy) */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Size</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {["XS", "S", "M", "L", "XL"].map((size) => (
                      <button key={size} className="aspect-square border border-gray-200 text-[10px] font-bold hover:border-black transition-all">
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto flex gap-4">
                <button 
                  onClick={() => {
                    setFilterCategory(null);
                    setIsFilterOpen(false);
                  }}
                  className="flex-1 py-4 text-xs font-bold uppercase tracking-widest border border-black hover:bg-black hover:text-white transition-all"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 py-4 text-xs font-bold uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-all"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
