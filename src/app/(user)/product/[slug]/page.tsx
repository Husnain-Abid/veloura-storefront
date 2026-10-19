
import dbConnect from "@/lib/mongodb";
import { Product } from "@/models";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductDetails } from "@/components/product/ProductDetails";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ArrowLeft, ArrowUpRight, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await dbConnect();

  const { slug } = await params;
  const productDoc = await Product.findOne({ slug });

  if (!productDoc) {
    notFound();
  }

  const product = productDoc.toObject();

  product.id = product._id.toString();

  const rating = Number(product.rating) || 0;

  return (
    <main className="flex min-h-screen w-full flex-col bg-[#faf9f6] text-[#211e1a]">
      {/* Breadcrumb navigation */}
      <div className="border-b border-[#e9e2d8]">
        <div className="mx-auto flex max-w-[1600px] items-center gap-2 overflow-hidden px-5 py-5 text-[9px] font-medium uppercase tracking-[0.18em] sm:px-8 sm:text-[10px] lg:px-16">
          <Link
            href="/"
            className="shrink-0 text-[#81796f] transition-colors hover:text-black"
          >
            Home
          </Link>

          <span className="text-[#c1b5a6]">/</span>

          <Link
            href="/shop"
            className="shrink-0 text-[#81796f] transition-colors hover:text-black"
          >
            Shop
          </Link>

          <span className="text-[#c1b5a6]">/</span>

          <span className="truncate text-[#211e1a]">
            {product.name}
          </span>
        </div>
      </div>

      {/* Product details */}
      <section className="mx-auto w-full max-w-[1600px] px-5 py-8 sm:px-8 sm:py-12 lg:px-16 lg:py-16">
        <div className="mb-7 flex items-center justify-between sm:mb-10">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#81796f] transition-colors hover:text-[#211e1a] sm:text-[10px]"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-1"
            />
            Continue Shopping
          </Link>

          <span className="hidden items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#a88c68] sm:flex sm:text-[10px]">
            <span className="h-px w-6 bg-[#a88c68]" />
            The Veloura Collection
          </span>
        </div>

        <ProductDetails product={product} />
      </section>

      {/* Related products */}
      <section className="border-y border-[#e9e2d8] bg-white">
        <FeaturedProducts
          title="You May Also Love"
          subtitle="Selected for You"
          type="featured"
        />
      </section>

      {/* Customer reviews */}
      <section
        id="reviews"
        className="bg-[#faf9f6] px-5 py-20 sm:px-8 sm:py-24 lg:px-16 lg:py-28"
      >
        <div className="mx-auto max-w-5xl">
          {/* Section heading */}
          <div className="mb-12 text-center sm:mb-16">
            <div className="mb-5 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#a88c68]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#8c7b66]">
                The Customer Experience
              </span>

              <span className="h-px w-8 bg-[#a88c68]" />
            </div>

            <h2 className="font-serif text-4xl font-normal tracking-[-0.035em] sm:text-5xl">
              The Details Matter
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#77716a]">
              Discover what customers think about their Veloura
              experience.
            </p>
          </div>

          {/* Rating overview */}
          <div className="grid grid-cols-1 gap-8 border-y border-[#e5ddd2] py-10 sm:grid-cols-3 sm:items-center sm:gap-10 sm:py-12">
            <div className="text-center">
              <span className="mb-3 block font-serif text-6xl font-normal">
                {rating.toFixed(1)}
              </span>

              <div
                className="mb-3 flex justify-center gap-1"
                aria-label={`${rating} out of 5 stars`}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={15}
                    strokeWidth={1.2}
                    className={
                      star <= Math.round(rating)
                        ? "fill-[#a88c68] text-[#a88c68]"
                        : "text-[#d8cfc3]"
                    }
                  />
                ))}
              </div>

              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#81796f]">
                Product Rating
              </p>
            </div>

            <div className="text-center sm:col-span-2 sm:border-l sm:border-[#e5ddd2] sm:pl-10 sm:text-left">
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#8c7b66]">
                Quality over everything
              </span>

              <h3 className="mt-3 font-serif text-2xl sm:text-3xl">
                Made to be worn. Made to be loved.
              </h3>

              <p className="mt-3 max-w-lg text-sm leading-7 text-[#77716a]">
                Every piece should feel right, from the fabric and
                fit to the finishing details. Your feedback helps
                us keep improving the experience.
              </p>
            </div>
          </div>

          {/* Actual review records should be rendered here */}
          <div className="py-14 text-center sm:py-16">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#e5ddd2] text-[#a88c68]">
              <Star size={19} strokeWidth={1.2} />
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl">
              Your experience matters.
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#77716a]">
              Customer reviews will appear here when actual reviews
              are available for this product.
            </p>

            <Link
              href="/shop"
              className="group mt-7 inline-flex items-center gap-3 border-b border-[#b8aa98] pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-[#211e1a]"
            >
              Discover More Styles

              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
