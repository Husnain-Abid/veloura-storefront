
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const slides = [
  {
    eyebrow: "The New Season Collection",
    title: "Elegance in\nEvery Detail",
    description:
      "Discover timeless silhouettes and contemporary essentials designed to make every moment feel extraordinary.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2400&q=90",
    imageAlt: "Women exploring contemporary fashion",
    label: "01",
    collection: "NEW ARRIVALS",
  },
  {
    eyebrow: "Effortless. Refined. Unforgettable.",
    title: "Your Style,\nYour Statement",
    description:
      "From everyday essentials to statement pieces, find the styles that express who you are.",
    image:
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=2400&q=90",
    imageAlt: "Elegant contemporary women's fashion",
    label: "02",
    collection: "WOMEN'S EDIT",
  },
  {
    eyebrow: "Made for Your Moments",
    title: "Confidence Looks\nGood on You",
    description:
      "Explore carefully selected pieces that bring together modern design, comfort, and confidence.",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2400&q=90",
    imageAlt: "Curated women's fashion and wardrobe styling",
    label: "03",
    collection: "EXPLORE THE EDIT",
  },
];

const AUTOPLAY_DELAY = 3000;

export const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = slides[activeIndex];

  const goToSlide = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  const nextSlide = () => {
    goToSlide(activeIndex + 1);
  };

  const previousSlide = () => {
    goToSlide(activeIndex - 1);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, AUTOPLAY_DELAY);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      aria-label="Veloura featured fashion collection"
      aria-roledescription="carousel"
      className="relative isolate h-[78svh] min-h-[560px] max-h-[900px] w-full overflow-hidden bg-[#171512] text-white md:h-[85vh]"
    >
      {/* Background image carousel */}
      <AnimatePresence initial={false}>
        <motion.div
          key={activeSlide.image}
          role="img"
          aria-label={activeSlide.imageAlt}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url("${activeSlide.image}")`,
          }}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.1, ease: "easeInOut" },
            scale: { duration: 6.5, ease: "linear" },
          }}
        />
      </AnimatePresence>

      {/* Readability overlays */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

      {/* Subtle decorative frame */}
      <div className="pointer-events-none absolute inset-4 border border-white/15 md:inset-7" />

      {/* Main content */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] flex-col justify-center px-8 pb-16 pt-10 sm:px-14 md:px-20 lg:px-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.label}
            className="max-w-3xl"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -12 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.15,
                },
              },
            }}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7 },
                },
              }}
              className="mb-6 flex items-center gap-4"
            >
              <span className="h-px w-10 bg-[#d9c3a5]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/90 sm:text-xs sm:tracking-[0.4em]">
                {activeSlide.eyebrow}
              </span>
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.85,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
              }}
              className="whitespace-pre-line font-serif text-[clamp(3.2rem,8vw,7.5rem)] font-normal leading-[0.98] tracking-[-0.045em]"
            >
              {activeSlide.title}
            </motion.h1>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7 },
                },
              }}
              className="mt-7 max-w-lg text-sm leading-7 text-white/75 sm:text-base sm:leading-8"
            >
              {activeSlide.description}
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7 },
                },
              }}
              className="mt-9 flex flex-wrap items-center gap-5"
            >
              <Link
                href="/shop"
                className="group inline-flex min-h-14 items-center justify-center gap-6 bg-[#f5f0e8] px-7 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#171512] transition-colors duration-300 hover:bg-white sm:px-9"
              >
                Shop Collection
                <span
                  aria-hidden="true"
                  className="text-lg transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>

              <span className="text-[10px] uppercase tracking-[0.22em] text-white/75">
                {activeSlide.collection}
              </span>
            </motion.div>
          </motion.div>
        </AnimatePresence>


        {/* Carousel controls */}
        <div className="absolute bottom-12 left-8 right-8 flex items-end justify-end sm:left-14 sm:right-14 md:bottom-14 md:left-20 md:right-20 lg:left-28 lg:right-28">
          {/* Slide counter and progress indicators — right side */}
          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-2.5">
              {slides.map((slide, index) => (
                <button
                  key={slide.label}
                  type="button"
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={activeIndex === index ? "true" : undefined}
                  onClick={() => goToSlide(index)}
                  className="group flex h-5 items-center"
                >
                  <span
                    className={`block h-[2px] transition-all duration-500 ${activeIndex === index
                        ? "w-12 bg-white"
                        : "w-6 bg-white/40 group-hover:bg-white/80"
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>


      </div>
    </section>
  );
};
