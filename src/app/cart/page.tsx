"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeItem, updateQuantity, clearCart } from "@/store/slices/cartSlice";
import { formatPrice, cn } from "@/lib/utils";
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 5000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-4xl font-serif mb-4">Your Bag is Empty</h1>
        <p className="text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
          Looks like you haven&apos;t added anything to your bag yet. 
          Explore our new arrivals and find your perfect outfit.
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
      <h1 className="text-5xl md:text-7xl font-serif mb-12">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="hidden md:grid grid-cols-6 border-b border-gray-100 pb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            <div className="col-span-3">Product</div>
            <div className="text-center">Price</div>
            <div className="text-center">Quantity</div>
            <div className="text-right">Total</div>
          </div>

          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="grid grid-cols-1 md:grid-cols-6 gap-6 items-center pb-8 border-b border-gray-50">
              <div className="flex gap-6 col-span-1 md:col-span-3">
                <div className="w-24 aspect-[3/4] bg-gray-100 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <Link href={`/product/${item.slug}`} className="text-sm font-bold uppercase hover:underline mb-2">
                    {item.name}
                  </Link>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                    Size: {item.size} | Color: {item.color}
                  </span>
                  <button 
                    onClick={() => dispatch(removeItem({ id: item.id, size: item.size, color: item.color }))}
                    className="mt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors w-fit"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>
              </div>

              <div className="hidden md:block text-center text-sm font-medium">
                {formatPrice(item.price)}
              </div>

              <div className="flex justify-center">
                <div className="flex items-center border border-gray-200 h-10">
                  <button 
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1, size: item.size, color: item.color }))}
                    className="px-3 hover:bg-gray-50 h-full transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold">{item.quantity}</span>
                  <button 
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1, size: item.size, color: item.color }))}
                    className="px-3 hover:bg-gray-50 h-full transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="flex justify-between md:justify-end items-center md:items-start w-full">
                <span className="md:hidden text-[10px] font-bold uppercase text-gray-400">Total</span>
                <span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6">
            <Link 
              href="/shop"
              className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-colors"
            >
              Continue Shopping
            </Link>
            <button 
              onClick={() => dispatch(clearCart())}
              className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              Clear Bag
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#f9f9f9] p-8 space-y-8">
            <h3 className="text-xl font-bold uppercase tracking-tighter">Order Summary</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-black">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-bold text-black">{total >= 5000 ? "FREE" : "Calculated at next step"}</span>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <div className="flex justify-between text-lg font-bold uppercase tracking-widest">
                <span>Estimated Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-2">
                Tax included. Shipping calculated at checkout.
              </p>
            </div>

            {remainingForFreeShipping > 0 && (
              <div className="p-4 bg-white border border-gray-100">
                 <p className="text-[10px] font-bold uppercase tracking-widest mb-3">
                    Add {formatPrice(remainingForFreeShipping)} more to get FREE SHIPPING
                 </p>
                 <div className="h-1 bg-gray-100 w-full">
                    <div 
                      className="h-full bg-black" 
                      style={{ width: `${(total / freeShippingThreshold) * 100}%` }} 
                    />
                 </div>
              </div>
            )}

            <div className="space-y-4">
              <Link 
                href="/checkout"
                className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-5 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>
              
              <div className="pt-4 flex flex-col gap-4">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Exchange only within 7 days</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Secure payments with JazzCash & Easypaisa</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
