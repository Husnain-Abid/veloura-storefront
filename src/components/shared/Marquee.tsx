
"use client";

type MarqueeProps = {
  items: string[];
};

export const Marquee = ({ items }: MarqueeProps) => {
  if (!items.length) return null;

  return (
    <section
      aria-label="Store announcements"
      className="relative overflow-hidden border-b border-[#d8cbb9] bg-[#25221e] py-4 text-[#f5f0e8]"
    >
      <div className="flex w-max animate-veloura-marquee motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center"
          >
            {items.map((item, index) => (
              <div
                key={`${copy}-${index}`}
                className="flex shrink-0 items-center gap-7 px-5 sm:gap-10 sm:px-8"
              >
                <span className="text-[10px] font-medium uppercase tracking-[0.17em] sm:text-[11px] sm:tracking-[0.22em]">
                  {item}
                </span>

                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rotate-45 bg-[#a88c68]"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
