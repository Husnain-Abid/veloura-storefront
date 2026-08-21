"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Image Placeholder */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] hover:scale-110"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-start text-white">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4"
        >
          New Collection 2024
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-8xl font-serif mb-8 leading-tight"
        >
          Elegance in <br /> Every Detail
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link 
            href="/shop"
            className="group relative inline-flex items-center gap-4 bg-white text-black px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-500"
          >
            Shop Now
            <span className="w-8 h-[1px] bg-black group-hover:bg-white transition-colors" />
          </Link>
        </motion.div>
      </div>

      <div className="absolute bottom-10 right-10 flex gap-4 text-white/50 text-xs tracking-widest uppercase">
        <span>01 / 03</span>
      </div>
    </section>
  );
};
