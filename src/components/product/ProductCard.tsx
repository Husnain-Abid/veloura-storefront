"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/store/useStore";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    salePrice?: number | string | null;
    images: string[];
    stock: number;
    isNewArrival?: boolean;
    isFlashSale?: boolean;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(product.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.images[0],
        slug: product.slug,
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.salePrice || product.price),
      image: product.images[0],
      quantity: 1,
      slug: product.slug,
    });
  };

  return (
    <div 
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <Link href={`/product/${product.slug}`}>
          <img 
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]} 
            alt={product.name}
            className="h-full w-full object-cover object-center transition-all duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNewArrival && (
            <span className="bg-white text-black text-[9px] font-bold uppercase tracking-widest px-2 py-1 shadow-sm">
              New
            </span>
          )}
          {product.salePrice && (
            <span className="bg-red-600 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 shadow-sm">
              Sale
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-black/50 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 backdrop-blur-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <button 
            onClick={handleWishlist}
            className={cn(
              "p-3 bg-white hover:bg-black hover:text-white transition-colors duration-300 shadow-xl",
              inWishlist && "bg-black text-white"
            )}
          >
            <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} />
          </button>
          <button 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-white text-black text-[10px] font-bold uppercase tracking-widest py-3 px-4 hover:bg-black hover:text-white transition-colors duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
          <button className="p-3 bg-white hover:bg-black hover:text-white transition-colors duration-300 shadow-xl">
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 flex flex-col gap-1">
        <h3 className="text-xs font-medium uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
          <Link href={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="flex items-center gap-2">
          {product.salePrice ? (
            <>
              <span className="text-sm font-bold">{formatPrice(product.salePrice)}</span>
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>
            </>
          ) : (
            <span className="text-sm font-bold">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  );
};
