"use client";

import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useStore";
import { formatPrice, cn } from "@/lib/utils";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const total = subtotal();
  const freeShippingThreshold = 5000;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[110] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-lg font-bold uppercase tracking-tighter">Your Bag</h2>
                <span className="bg-black text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                  {items.reduce((acc, i) => acc + i.quantity, 0)}
                </span>
              </div>
              <button onClick={onClose}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Shipping Progress */}
            <div className="p-6 bg-gray-50">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2">
                {remainingForFreeShipping > 0 
                  ? `Add ${formatPrice(remainingForFreeShipping)} more for FREE SHIPPING`
                  : "You qualify for FREE SHIPPING!"
                }
              </p>
              <div className="h-1 bg-gray-200 w-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (total / freeShippingThreshold) * 100)}%` }}
                  className="h-full bg-black"
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                    <div className="w-20 aspect-[3/4] bg-gray-100 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <Link href={`/product/${item.slug}`} className="text-xs font-bold uppercase hover:underline">
                          {item.name}
                        </Link>
                        <button 
                          onClick={() => removeItem(item.id, item.size, item.color)}
                          className="text-gray-400 hover:text-black"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">
                        {item.size} / {item.color}
                      </span>
                      <div className="mt-auto flex justify-between items-center">
                        <div className="flex items-center border border-gray-200">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                            className="p-1 hover:bg-gray-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-[10px] font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                            className="p-1 hover:bg-gray-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-bold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-200 mb-4" />
                  <p className="text-sm text-gray-500 uppercase tracking-widest">Your bag is empty</p>
                  <button 
                    onClick={onClose}
                    className="mt-6 text-xs font-bold uppercase tracking-widest border-b border-black pb-1"
                  >
                    Start Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest italic">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="flex flex-col gap-2">
                  <Link 
                    href="/cart"
                    onClick={onClose}
                    className="w-full py-4 border border-black text-center text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                  >
                    View Bag
                  </Link>
                  <Link 
                    href="/checkout"
                    onClick={onClose}
                    className="w-full py-4 bg-black text-white text-center text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                  >
                    Checkout <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
