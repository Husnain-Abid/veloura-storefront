"use client";

import { useWishlistStore, useCartStore } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import { Trash2, ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
          <Heart className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-4xl font-serif mb-4">Your Wishlist is Empty</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
          Save items you love to your wishlist and they'll appear here.
        </p>
        <Link 
          href="/shop"
          className="bg-black text-white text-xs font-bold uppercase tracking-widest px-12 py-5 hover:bg-gray-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-5xl md:text-7xl font-serif mb-12">My Wishlist</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12">
        {items.map((item) => (
          <div key={item.id} className="relative group">
            <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => removeItem(item.id)}
                className="absolute top-4 right-4 p-2 bg-white text-black hover:bg-black hover:text-white transition-all shadow-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="pt-4 flex flex-col gap-1">
              <h3 className="text-xs font-medium uppercase tracking-widest text-gray-500">
                <Link href={`/product/${item.slug}`}>{item.name}</Link>
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold">{formatPrice(item.price)}</span>
                <button 
                  onClick={() => {
                    addItem({
                      ...item,
                      quantity: 1,
                    });
                    removeItem(item.id);
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:opacity-50 transition-all"
                >
                  Move to Bag
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
