
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const CATEGORIES = [
  {
    name: "Western Wear",
    slug: "western-wear",
    eyebrow: "01 — THE EVERYDAY EDIT",
    description: "Contemporary silhouettes. Effortless confidence.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1400&auto=format&fit=crop",
    layout: "md:col-span-2 md:row-span-2",
  },
  {
    name: "Intimates",
    slug: "undergarments",
    eyebrow: "02 — FEEL GOOD",
    description: "Comfort in every detail.",
    image:
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?q=80&w=1000&auto=format&fit=crop",
    layout: "md:col-span-1",
  },
  {
    name: "New Arrivals",
    slug: "new-arrivals",
    eyebrow: "03 — JUST LANDED",
    description: "Your next favorite, waiting to be discovered.",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1000&auto=format&fit=crop",
    layout: "md:col-span-1",
  },
];

export const CategoryGrid = () => {
  return (
    <section className="bg-[#faf9f6] py-20 text-[#211e1a] sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-16">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="mb-10 flex flex-col gap-6 sm:mb-14 md:flex-row md:items-end md:justify-between lg:mb-16"
        >
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#a88c68]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#8c7b66]">
                Find Your Signature
              </span>
            </div>

            <h2 className="max-w-2xl font-serif text-4xl font-normal leading-tight tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              Curated for{" "}
              <span className="italic text-[#a88c68]">your</span> world.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-[#77716a] sm:text-base">
              Thoughtfully selected styles for every mood, moment, and version
              of you.
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex w-fit items-center gap-4 border-b border-[#b8aa98] pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-[#211e1a]"
          >
            Explore All Collections
            <span
              aria-hidden="true"
              className="text-base transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </motion.div>

        {/* Editorial category layout */}
        <div className="grid grid-cols-1 gap-4 md:h-[690px] md:grid-cols-3 md:grid-rows-2 lg:h-[780px] lg:gap-5">
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{
                duration: 0.65,
                delay: index * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`min-w-0 ${category.layout} ${
                index === 0 ? "md:row-span-2" : "md:row-span-1"
              }`}
            >
              <Link
                href={`/shop?category=${category.slug}`}
                aria-label={`Explore ${category.name}`}
                className="group relative flex h-[440px] min-h-0 w-full overflow-hidden bg-[#e9e3da] sm:h-[520px] md:h-full"
              >
                {/* Category photography */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                  style={{
                    backgroundImage: `url("${category.image}")`,
                  }}
                />

                {/* Layered contrast */}
                <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/5" />

                {/* Fine editorial border */}
                <div className="pointer-events-none absolute inset-3 border border-white/0 transition-all duration-500 group-hover:inset-5 group-hover:border-white/40 sm:inset-4" />

                {/* Category content */}
                <div className="relative z-10 flex h-full w-full flex-col justify-between p-7 text-white sm:p-9 lg:p-10">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/85 sm:text-[10px] sm:tracking-[0.28em]">
                      {category.eyebrow}
                    </span>

                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/50 text-sm transition-all duration-500 group-hover:border-white group-hover:bg-white group-hover:text-[#211e1a]"
                    >
                      ↗
                    </span>
                  </div>

                  <div className="max-w-lg">
                    <p className="mb-3 text-xs leading-6 text-white/80 sm:text-sm">
                      {category.description}
                    </p>

                    <h3 className="font-serif text-3xl font-normal tracking-[-0.025em] sm:text-4xl lg:text-5xl">
                      {category.name}
                    </h3>

                    <div className="mt-5 flex items-center gap-3">
                      <span className="h-px w-7 bg-[#d9c3a5] transition-all duration-500 group-hover:w-12" />
                      <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/90 sm:text-[10px]">
                        Discover Collection
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
