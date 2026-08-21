"use client";

import { useState, useEffect } from "react";
import { X, Search, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-[200] flex flex-col p-6 md:p-24"
        >
          <div className="flex justify-end mb-12">
            <button 
              onClick={onClose}
              className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:text-gray-400 transition-colors"
            >
              Close <X className="w-6 h-6" />
            </button>
          </div>

          <div className="max-w-4xl mx-auto w-full">
            <div className="relative border-b-2 border-black pb-4 mb-12">
              <input 
                autoFocus
                type="text"
                placeholder="Search products, collections, blog..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-4xl md:text-6xl font-serif focus:outline-none placeholder:text-gray-100"
              />
              <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 text-gray-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8">Popular Searches</h4>
                <div className="flex flex-col gap-4">
                  {["Silk Dress", "Lace Intimates", "New Arrivals", "Flash Sale"].map((item) => (
                    <button 
                      key={item}
                      onClick={() => setQuery(item)}
                      className="text-2xl font-serif text-left hover:pl-4 transition-all hover:text-gray-500"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8">Quick Links</h4>
                <div className="flex flex-col gap-6">
                  {["About Us", "Shipping Policy", "Size Guide", "FAQs"].map((item) => (
                    <Link 
                      key={item}
                      href="#"
                      className="flex items-center justify-between text-xs font-bold uppercase tracking-widest border-b border-gray-100 pb-4 group hover:border-black transition-colors"
                    >
                      {item}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
