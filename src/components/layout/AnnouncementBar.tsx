"use client";

import { motion } from "framer-motion";

export const AnnouncementBar = () => {
  return (
    <div className="bg-black text-white text-[10px] md:text-xs py-2 overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: ["100%", "-100%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="inline-block"
      >
        <span className="mx-8 uppercase tracking-widest">Free Shipping on orders above PKR 5000</span>
        <span className="mx-8 uppercase tracking-widest">Exchange only policy - Shop with confidence</span>
        <span className="mx-8 uppercase tracking-widest">New Arrivals: The Winter Collection is Live!</span>
        <span className="mx-8 uppercase tracking-widest">Free Shipping on orders above PKR 5000</span>
      </motion.div>
    </div>
  );
};
