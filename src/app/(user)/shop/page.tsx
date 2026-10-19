import dbConnect from "@/lib/mongodb";
import { Product, Category } from "@/models";
import { ProductListing } from "@/components/product/ProductListing";
import { Suspense } from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    q?: string;
  }>;
}

function ShopLoading() {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
      aria-label="Loading products"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="aspect-[3/4] bg-[#eeeae3]" />
          <div className="mt-4 h-3 w-3/4 bg-[#eeeae3]" />
          <div className="mt-2 h-3 w-1/2 bg-[#eeeae3]" />
        </div>
      ))}
    </div>
  );
}

export default async function ShopPage({
  searchParams,
}: ShopPageProps) {
  await dbConnect();

  const params = await searchParams;
  const categorySlug = params.category?.trim();
  const searchTerm = params.q?.trim();
  const sort = params.sort;

  const query: Record<string, any> = {};

  // Filter by category.
  if (categorySlug) {
    const category = await Category.findOne({
      slug: categorySlug,
    }).lean();

    if (category) {
      query.categoryId = category._id;
    } else {
      // A supplied but unknown category should not show every product.
      query._id = { $exists: false };
    }
  }

  // Search by product name or description.
  if (searchTerm) {
    const escapedTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    query.$or = [
      { name: { $regex: escapedTerm, $options: "i" } },
      { description: { $regex: escapedTerm, $options: "i" } },
    ];
  }

  // Apply supported sorting options.
  let sortQuery: Record<string, 1 | -1> = {
    createdAt: -1,
  };

  switch (sort) {
    case "price-low":
      sortQuery = { price: 1 };
      break;
    case "price-high":
      sortQuery = { price: -1 };
      break;
    case "name":
      sortQuery = { name: 1 };
      break;
    case "newest":
    default:
      sortQuery = { createdAt: -1 };
      break;
  }

  const results = await Product.find(query)
    .sort(sortQuery)
    .lean();

  const allProducts = results.map((product: any) => ({
    ...product,
    id: String(product._id),
    _id: String(product._id),
  }));

  const pageTitle = searchTerm
    ? "Search Results"
    : categorySlug
      ? categorySlug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "The Collection";

  const description = searchTerm
    ? `Explore the pieces matching "${searchTerm}".`
    : categorySlug
      ? `Discover our curated selection of ${pageTitle.toLowerCase()}, thoughtfully selected for your wardrobe.`
      : "Discover our curated selection of premium western wear and luxury intimates. Every piece brings together contemporary style, comfort, and considered design.";

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#211e1a]">
      <div className="mx-auto w-full max-w-[1600px] px-5 pb-20 pt-7 sm:px-8 sm:pt-10 lg:px-16 lg:pb-28">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mb-10 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.17em] text-[#918a7f]"
        >
          <Link
            href="/"
            className="transition-colors hover:text-[#211e1a]"
          >
            Home
          </Link>

          <span aria-hidden="true">/</span>

          <span className="text-[#211e1a]">Shop</span>

          {categorySlug && (
            <>
              <span aria-hidden="true">/</span>
              <span className="max-w-[150px] truncate text-[#211e1a]">
                {pageTitle}
              </span>
            </>
          )}
        </nav>

        {/* Editorial collection header */}
        <header className="relative mb-10 overflow-hidden border-b border-[#e6e0d6] pb-10 sm:mb-14 sm:pb-14">
          <div className="grid gap-8 md:grid-cols-[1fr_280px] md:items-end lg:grid-cols-[1fr_350px]">
            <div>
              <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#9a7851]">
                <span className="h-px w-8 bg-[#a88c68]" />
                The Veloura Edit
              </p>

              <h1 className="max-w-4xl font-serif text-[42px] leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                {pageTitle}
                <span className="text-[#a88c68]">.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#777066] sm:text-base sm:leading-8">
                {description}
              </p>
            </div>

            <div className="hidden border-l border-[#e6e0d6] pl-7 pb-1 md:block">
              <p className="font-serif text-2xl leading-snug">
                Style that feels
                <br />
                <span className="italic text-[#a88c68]">
                  unmistakably you.
                </span>
              </p>

              <p className="mt-4 text-[10px] uppercase leading-5 tracking-[0.16em] text-[#918a7f]">
                Thoughtfully selected
                <br />
                Made for everyday elegance
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[#e6e0d6] pt-4 text-[10px] uppercase tracking-[0.15em] text-[#918a7f]">
            <span>Discover your next favourite</span>

            <span>
              {allProducts.length}{" "}
              {allProducts.length === 1 ? "piece" : "pieces"}
            </span>
          </div>
        </header>

        {/* Product listing */}
        <section aria-label="Shop products">
          <Suspense fallback={<ShopLoading />}>
            <ProductListing products={allProducts} />
          </Suspense>
        </section>

        {/* Empty state */}
        {allProducts.length === 0 && (
          <div className="py-16 text-center sm:py-24">
            <p className="font-serif text-2xl sm:text-3xl">
              Nothing here just yet.
            </p>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#777066]">
              Try another search or explore our full collection to find
              something you love.
            </p>

            <Link
              href="/shop"
              className="mt-7 inline-flex min-h-12 items-center justify-center bg-[#211e1a] px-7 text-[10px] font-semibold uppercase tracking-[0.17em] text-white transition hover:bg-[#40392f]"
            >
              Explore All Pieces
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
