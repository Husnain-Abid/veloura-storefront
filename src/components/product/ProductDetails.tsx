"use client";

import { useState } from "react";
import { 
  Star, 
  Minus, 
  Plus, 
  Heart, 
  Share2, 
  Truck, 
  RefreshCw, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice, cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/slices/wishlistSlice";

interface ProductDetailsProps {
  product: any;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const dispatch = useAppDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "");
  const [quantity, setQuantity] = useState(1);

  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((i) => i.id === product.id);

  const productImages = product.images.map((img: any) => typeof img === 'string' ? img : img.url);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      alert("Please select a size");
      return;
    }
    
    dispatch(addItem({
      id: product.id,
      name: product.name,
      price: Number(product.salePrice || product.price),
      image: productImages[0],
      quantity: quantity,
      size: selectedSize,
      color: selectedColor,
      slug: product.slug,
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
      {/* Gallery */}
      <div className="flex flex-col gap-4">
        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
          <motion.img 
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={productImages[selectedImage]} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {productImages.map((img: string, idx: number) => (
            <button 
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={cn(
                "aspect-[3/4] border-2 transition-all overflow-hidden",
                selectedImage === idx ? "border-black" : "border-transparent"
              )}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={cn("w-4 h-4 fill-current", i >= Math.floor(product.rating) && "text-gray-200 fill-none")} />
              ))}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              {product.reviewCount} Reviews
            </span>
          </div>
          <div className="flex items-center gap-4">
            {product.salePrice ? (
              <>
                <span className="text-3xl font-bold">{formatPrice(product.salePrice)}</span>
                <span className="text-xl text-gray-400 line-through">{formatPrice(product.price)}</span>
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                  Save {Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-8 mb-10 pb-10 border-b border-gray-100">
          {/* Colors */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Color: {selectedColor}</h4>
            <div className="flex gap-3">
              {product.colors.map((color: any) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={cn(
                    "w-8 h-8 rounded-full border border-gray-200 p-1 transition-all",
                    selectedColor === color.name ? "ring-1 ring-black ring-offset-2" : ""
                  )}
                >
                  <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">Size: {selectedSize || "Select Size"}</h4>
              <button className="text-[10px] font-bold uppercase tracking-[0.2em] underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "min-w-[50px] px-4 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all",
                    selectedSize === size ? "bg-black text-white border-black" : "bg-white text-black border-gray-200 hover:border-black"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Add */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center border border-gray-200">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-sm font-bold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white text-xs font-bold uppercase tracking-widest py-4 hover:bg-gray-800 transition-colors"
            >
              Add to Cart
            </button>
            <button 
              onClick={() => {
                if (isInWishlist) {
                  dispatch(removeFromWishlist(product.id));
                } else {
                  dispatch(addToWishlist({
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image: productImages[0],
                    slug: product.slug,
                  }));
                }
              }}
              className="p-4 border border-gray-200 hover:border-black transition-colors"
            >
              <Heart className={cn("w-5 h-5", isInWishlist && "fill-black")} />
            </button>
          </div>

          <button className="w-full py-4 bg-[#5a31f4] text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
            Buy It Now
          </button>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="flex flex-col items-center text-center gap-2">
            <Truck className="w-5 h-5 text-gray-400" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Fast Delivery</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <RefreshCw className="w-5 h-5 text-gray-400" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Exchange Only</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gray-400" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Secure Checkout</span>
          </div>
        </div>

        {/* Accordions (Simulated) */}
        <div className="divide-y divide-gray-100 border-t border-gray-100">
          {[
            { title: "Description", content: product.description },
            { title: "Material & Care", content: product.material + ". " + product.careInstructions },
            { title: "Shipping & Returns", content: "Orders are shipped within 2-3 business days. We offer exchange only policy within 7 days." }
          ].map((item, idx) => (
            <details key={idx} className="group py-4">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-xs font-bold uppercase tracking-widest">{item.title}</span>
                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 text-sm text-gray-500 leading-relaxed">
                {item.content}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};
