"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import {
  ChevronDown,
  SlidersHorizontal,
  X,
  Search,
  ArrowUpDown,
  RotateCcw,
  Check,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductListingProps {
  products: any[];
}

type PriceRange = "all" | "under-2500" | "2500-5000" | "over-5000";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const PRICE_RANGES: {
  value: PriceRange;
  label: string;
}[] = [
  { value: "all", label: "All prices" },
  { value: "under-2500", label: "Under PKR 2,500" },
  { value: "2500-5000", label: "PKR 2,500 – 5,000" },
  { value: "over-5000", label: "PKR 5,000+" },
];

function getId(value: any): string {
  if (value == null) return "";

  if (typeof value === "object") {
    return String(value._id ?? value.id ?? "");
  }

  return String(value);
}

function getProductPrice(product: any): number {
  const price = Number(product.salePrice);
  const originalPrice = Number(product.price);

  if (
    product.salePrice !== undefined &&
    product.salePrice !== null &&
    product.salePrice !== "" &&
    Number.isFinite(price) &&
    Number.isFinite(originalPrice) &&
    price > 0 &&
    originalPrice > price
  ) {
    return price;
  }

  return Number.isFinite(originalPrice) ? originalPrice : 0;
}

function getProductSizes(product: any): string[] {
  const sizes = new Set<string>();

  if (Array.isArray(product.sizes)) {
    product.sizes.forEach((item: any) => {
      const size =
        typeof item === "string"
          ? item
          : item?.name ?? item?.size;

      if (size) sizes.add(String(size).toUpperCase());
    });
  }

  if (Array.isArray(product.variants)) {
    product.variants.forEach((variant: any) => {
      if (!Array.isArray(variant.sizes)) return;

      variant.sizes.forEach((item: any) => {
        const size =
          typeof item === "string"
            ? item
            : item?.name ?? item?.size;

        if (size) sizes.add(String(size).toUpperCase());
      });
    });
  }

  return Array.from(sizes);
}

function getCategoryLabel(product: any): string {
  if (typeof product.category === "string" && product.category.trim()) {
    return product.category.trim();
  }

  if (
    product.category &&
    typeof product.category === "object" &&
    (product.category.name || product.category.title)
  ) {
    return String(product.category.name ?? product.category.title);
  }

  if (product.categoryName) {
    return String(product.categoryName);
  }

  return "";
}

export const ProductListing = ({
  products: initialProducts,
}: ProductListingProps) => {
  const [sortBy, setSortBy] = useState("newest");
  const [filterCategory, setFilterCategory] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange>("all");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const categoryMap = new Map<
      string,
      { id: string; label: string }
    >();

    initialProducts.forEach((product) => {
      const id = getId(product.categoryId);
      if (!id) return;

      const label = getCategoryLabel(product);

      if (!categoryMap.has(id)) {
        categoryMap.set(id, {
          id,
          // A category name should ideally be supplied by the server.
          label: label || `Category ${categoryMap.size + 1}`,
        });
      } else if (
        label &&
        categoryMap.get(id)?.label.startsWith("Category ")
      ) {
        categoryMap.set(id, { id, label });
      }
    });

    return Array.from(categoryMap.values());
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    const normalizedSearch = searchQuery.trim().toLowerCase();

    if (normalizedSearch) {
      result = result.filter((product) => {
        const name = String(product.name ?? "").toLowerCase();
        const description = String(
          product.description ?? ""
        ).toLowerCase();

        return (
          name.includes(normalizedSearch) ||
          description.includes(normalizedSearch)
        );
      });
    }

    if (filterCategory) {
      result = result.filter(
        (product) => getId(product.categoryId) === filterCategory
      );
    }

    if (priceRange !== "all") {
      result = result.filter((product) => {
        const price = getProductPrice(product);

        switch (priceRange) {
          case "under-2500":
            return price < 2500;

          case "2500-5000":
            return price >= 2500 && price <= 5000;

          case "over-5000":
            return price > 5000;

          default:
            return true;
        }
      });
    }

    if (selectedSizes.length > 0) {
      result = result.filter((product) => {
        const productSizes = getProductSizes(product);

        return selectedSizes.some((size) =>
          productSizes.includes(size)
        );
      });
    }

    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) => getProductPrice(a) - getProductPrice(b)
        );
        break;

      case "price-high":
        result.sort(
          (a, b) => getProductPrice(b) - getProductPrice(a)
        );
        break;

      case "name":
        result.sort((a, b) =>
          String(a.name ?? "").localeCompare(String(b.name ?? ""))
        );
        break;

      case "bestseller":
        result = result.filter((product) => product.isBestSeller);
        break;

      case "newest":
      default:
        result.sort((a, b) => {
          const dateA = new Date(
            a.createdAt ?? a.updatedAt ?? 0
          ).getTime();

          const dateB = new Date(
            b.createdAt ?? b.updatedAt ?? 0
          ).getTime();

          return dateB - dateA;
        });
        break;
    }

    return result;
  }, [
    initialProducts,
    searchQuery,
    filterCategory,
    priceRange,
    selectedSizes,
    sortBy,
  ]);

  const activeFilterCount =
    Number(Boolean(filterCategory)) +
    Number(priceRange !== "all") +
    selectedSizes.length;

  const hasActiveFilters =
    activeFilterCount > 0 || Boolean(searchQuery.trim());

  const clearFilters = () => {
    setFilterCategory("");
    setPriceRange("all");
    setSelectedSizes([]);
    setSearchQuery("");
    setSortBy("newest");
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((current) =>
      current.includes(size)
        ? current.filter((item) => item !== size)
        : [...current, size]
    );
  };

  return (
    <div className="flex flex-col gap-7 text-[#211e1a] sm:gap-9">
      {/* Collection toolbar */}
      <div className="flex flex-col gap-5 border-b border-[#e6e0d6] pb-6 sm:pb-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              aria-haspopup="dialog"
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border border-[#dcd5c9] px-4 text-[10px] font-semibold uppercase tracking-[0.15em] transition hover:border-[#211e1a] sm:px-5"
            >
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#211e1a] px-1 text-[9px] text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#918a7f]"
                strokeWidth={1.5}
              />

              <input
                type="search"
                aria-label="Search products"
                placeholder="Search the collection"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 w-full border border-[#e6e0d6] bg-transparent pl-10 pr-3 text-xs outline-none transition placeholder:text-[#a39c91] focus:border-[#211e1a]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <p
              className="text-[10px] uppercase tracking-[0.13em] text-[#918a7f]"
              aria-live="polite"
            >
              <span className="font-semibold text-[#211e1a]">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1 ? "piece" : "pieces"}
            </p>

            <label className="relative flex min-h-11 min-w-0 items-center border-b border-[#dcd5c9]">
              <ArrowUpDown
                aria-hidden="true"
                className="mr-2 h-3.5 w-3.5 shrink-0 text-[#918a7f]"
                strokeWidth={1.5}
              />

              <span className="sr-only">Sort products</span>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="w-full cursor-pointer appearance-none bg-transparent py-2 pr-7 text-[10px] font-semibold uppercase tracking-[0.1em] outline-none sm:w-40"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="bestseller">Best Sellers</option>
              </select>

              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-0 h-3.5 w-3.5 text-[#777066]"
              />
            </label>
          </div>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {filterCategory && (
              <button
                type="button"
                onClick={() => setFilterCategory("")}
                className="inline-flex items-center gap-2 border border-[#ded7cb] px-3 py-2 text-[10px] uppercase tracking-wider"
              >
                {categories.find((item) => item.id === filterCategory)?.label ??
                  "Category"}
                <X className="h-3 w-3" />
              </button>
            )}

            {priceRange !== "all" && (
              <button
                type="button"
                onClick={() => setPriceRange("all")}
                className="inline-flex items-center gap-2 border border-[#ded7cb] px-3 py-2 text-[10px] uppercase tracking-wider"
              >
                {PRICE_RANGES.find((item) => item.value === priceRange)?.label}
                <X className="h-3 w-3" />
              </button>
            )}

            {selectedSizes.map((size) => (
              <button
                type="button"
                key={size}
                onClick={() => toggleSize(size)}
                className="inline-flex items-center gap-2 border border-[#ded7cb] px-3 py-2 text-[10px] uppercase tracking-wider"
              >
                Size: {size}
                <X className="h-3 w-3" />
              </button>
            ))}

            {searchQuery.trim() && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-2 border border-[#ded7cb] px-3 py-2 text-[10px] uppercase tracking-wider"
              >
                Search: {searchQuery.trim()}
                <X className="h-3 w-3" />
              </button>
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#8a6c48] underline underline-offset-4"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Product grid */}
      {filteredProducts.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id ?? getId(product._id)}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.22 }}
                className="min-w-0"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="flex min-h-[300px] flex-col items-center justify-center px-5 py-20 text-center sm:min-h-[380px]">
          <span className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#e6e0d6]">
            <Search className="h-5 w-5 text-[#9a7851]" strokeWidth={1.3} />
          </span>

          <p className="font-serif text-2xl sm:text-3xl">
            No pieces found.
          </p>

          <p className="mt-3 max-w-sm text-sm leading-6 text-[#777066]">
            Try adjusting your search or filters to discover more from the
            Veloura collection.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 bg-[#211e1a] px-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#40392f]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear Filters
          </button>
        </div>
      )}

      {/* Filter drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close filters"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 z-[100] cursor-default bg-[#211e1a]/45"
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="filter-drawer-title"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed inset-y-0 right-0 z-[110] flex w-[90%] max-w-[420px] flex-col bg-[#faf9f6] shadow-2xl"
            >
              {/* Drawer heading */}
              <div className="flex items-center justify-between border-b border-[#e6e0d6] px-6 py-6 sm:px-8">
                <div>
                  <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#9a7851]">
                    Refine your search
                  </p>

                  <h2
                    id="filter-drawer-title"
                    className="font-serif text-2xl"
                  >
                    The Filters
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  aria-label="Close filters"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6e0d6] transition hover:border-[#211e1a]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable filter options */}
              <div className="flex-1 space-y-8 overflow-y-auto px-6 py-7 sm:px-8">
                {/* Category */}
                <section>
                  <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.17em]">
                    Category
                  </h3>

                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setFilterCategory("")}
                      className="flex items-center justify-between border-b border-[#e6e0d6] py-3 text-left text-sm"
                    >
                      <span
                        className={
                          !filterCategory
                            ? "font-medium text-[#211e1a]"
                            : "text-[#777066]"
                        }
                      >
                        All Categories
                      </span>

                      {!filterCategory && (
                        <Check className="h-4 w-4 text-[#9a7851]" />
                      )}
                    </button>

                    {categories.map((category) => {
                      const active = filterCategory === category.id;

                      return (
                        <button
                          type="button"
                          key={category.id}
                          onClick={() =>
                            setFilterCategory(active ? "" : category.id)
                          }
                          className="flex items-center justify-between gap-3 border-b border-[#e6e0d6] py-3 text-left text-sm"
                        >
                          <span
                            className={
                              active
                                ? "font-medium text-[#211e1a]"
                                : "text-[#777066]"
                            }
                          >
                            {category.label}
                          </span>

                          {active && (
                            <Check className="h-4 w-4 shrink-0 text-[#9a7851]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* Price */}
                <section>
                  <h3 className="mb-4 text-[10px] font-semibold uppercase tracking-[0.17em]">
                    Price Range
                  </h3>

                  <div className="space-y-3">
                    {PRICE_RANGES.map((range) => (
                      <label
                        key={range.value}
                        className="flex cursor-pointer items-center gap-3 text-sm text-[#777066]"
                      >
                        <input
                          type="radio"
                          name="price-range"
                          value={range.value}
                          checked={priceRange === range.value}
                          onChange={() => setPriceRange(range.value)}
                          className="h-4 w-4 accent-[#211e1a]"
                        />

                        <span
                          className={
                            priceRange === range.value
                              ? "text-[#211e1a]"
                              : ""
                          }
                        >
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </section>

                {/* Sizes */}
                <section>
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.17em]">
                    Available Sizes
                  </h3>

                  <p className="mb-4 text-xs leading-5 text-[#918a7f]">
                    Select one or more sizes.
                  </p>

                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {SIZES.map((size) => {
                      const active = selectedSizes.includes(size);

                      return (
                        <button
                          type="button"
                          key={size}
                          aria-pressed={active}
                          onClick={() => toggleSize(size)}
                          className={cn(
                            "min-h-11 border text-xs transition",
                            active
                              ? "border-[#211e1a] bg-[#211e1a] text-white"
                              : "border-[#ded7cb] text-[#777066] hover:border-[#211e1a] hover:text-[#211e1a]"
                          )}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* Drawer actions */}
              <div className="border-t border-[#e6e0d6] bg-[#faf9f6] px-6 py-5 sm:px-8">
                <p className="mb-4 text-xs text-[#777066]">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "piece" : "pieces"} match
                  your selection
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterCategory("");
                      setPriceRange("all");
                      setSelectedSizes([]);
                    }}
                    className="flex min-h-12 flex-1 items-center justify-center gap-2 border border-[#dcd5c9] text-[10px] font-semibold uppercase tracking-[0.13em] transition hover:border-[#211e1a]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset Filters
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="min-h-12 flex-1 bg-[#211e1a] px-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-white transition hover:bg-[#40392f]"
                  >
                    View {filteredProducts.length} Pieces
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
