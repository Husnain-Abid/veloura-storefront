
import dbConnect from "@/lib/mongodb";
import { Product } from "@/models";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";

interface FeaturedProductsProps {
  title: string;
  subtitle?: string;
  type: "featured" | "new" | "bestseller" | "sale";
}

const SECTION_DETAILS = {
  featured: {
    eyebrow: "Handpicked for You",
    description: "Discover pieces we think deserve a place in your wardrobe.",
    accent: "The Edit",
  },
  new: {
    eyebrow: "Just Landed",
    description: "Meet the latest styles, thoughtfully selected for the new season.",
    accent: "New Season",
  },
  bestseller: {
    eyebrow: "Loved by You",
    description: "Explore the styles customers keep coming back for.",
    accent: "Customer Favorites",
  },
  sale: {
    eyebrow: "Special Offers",
    description: "Discover selected styles at prices worth a second look.",
    accent: "Limited Offers",
  },
} as const;

export const FeaturedProducts = async ({
  title,
  subtitle,
  type,
}: FeaturedProductsProps) => {
  await dbConnect();

  const query: Record<string, boolean> = {};

  if (type === "featured") {
    query.isFeatured = true;
  } else if (type === "new") {
    query.isNewArrival = true;
  } else if (type === "bestseller") {
    query.isBestSeller = true;
  } else if (type === "sale") {
    query.isFlashSale = true;
  }

  const data = await Product.find(query).limit(4).lean();

  const products = data.map((product) => ({
    ...product,
    id: String(product._id),
    _id: String(product._id),
  }));

  const details = SECTION_DETAILS[type];

  return (
    <section className="relative overflow-hidden bg-[#faf9f6] py-20 text-[#211e1a] sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-16">
        {/* Editorial heading */}
        <div className="mb-10 flex flex-col gap-6 sm:mb-14 md:flex-row md:items-end md:justify-between lg:mb-16">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#a88c68]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#8c7b66]">
                {subtitle || details.eyebrow}
              </span>
            </div>

            <h2 className="font-serif text-4xl font-normal leading-tight tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              {title}
              <span className="ml-2 font-serif italic text-[#a88c68]">
                .
              </span>
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-[#77716a] sm:text-base">
              {details.description}
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex w-fit shrink-0 items-center gap-4 border-b border-[#b8aa98] pb-3 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 hover:border-[#211e1a]"
          >
            Explore All Products

            <span
              aria-hidden="true"
              className="text-base transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
            {products.map((product) => (
              <div key={product.id} className="min-w-0">
                <ProductCard product={product as any} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[280px] flex-col items-center justify-center border border-[#e6dfd5] px-6 py-14 text-center">
            <span className="mb-4 h-px w-10 bg-[#a88c68]" />

            <h3 className="font-serif text-2xl sm:text-3xl">
              Something beautiful is on its way.
            </h3>

            <p className="mt-3 max-w-md text-sm leading-6 text-[#77716a]">
              We are refreshing this collection. Explore the shop to discover
              more styles.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex items-center gap-3 bg-[#211e1a] px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#a88c68]"
            >
              Explore the Shop
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}

        {/* Collection footer */}
        {products.length > 0 && (
          <div className="mt-10 flex items-center justify-between border-t border-[#e6dfd5] pt-5 sm:mt-14">
            <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#8c7b66] sm:text-[10px]">
              {details.accent}
            </span>

            <span className="text-[10px] uppercase tracking-[0.15em] text-[#77716a]">
              {products.length} {products.length === 1 ? "Piece" : "Pieces"}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
