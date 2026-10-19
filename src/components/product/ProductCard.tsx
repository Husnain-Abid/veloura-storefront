
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    salePrice?: number | string | null;
    images: any[];
    stock: number;
    isNewArrival?: boolean;
    isFlashSale?: boolean;
  };
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const wishlistItems = useAppSelector(
    (state) => state.wishlist.items
  );

  const inWishlist = wishlistItems.some(
    (item) => item.id === product.id
  );

  const productImages = (product.images ?? [])
    .map((img: any) =>
      typeof img === "string" ? img : img?.url
    )
    .filter((url: unknown): url is string =>
      typeof url === "string" && url.length > 0
    );

  const primaryImage = productImages[0];
  const secondaryImage = productImages[1];

  const price = Number(product.price);
  const salePrice =
    product.salePrice !== null &&
    product.salePrice !== undefined &&
    product.salePrice !== ""
      ? Number(product.salePrice)
      : null;

  const hasValidSale =
    salePrice !== null &&
    Number.isFinite(salePrice) &&
    Number.isFinite(price) &&
    salePrice > 0 &&
    salePrice < price;

  const discountPercentage = hasValidSale
    ? Math.round(((price - salePrice!) / price) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;

  const handleWishlist = () => {
    if (inWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(
        addToWishlist({
          id: product.id,
          name: product.name,
          price: hasValidSale ? salePrice! : price,
          image: primaryImage,
          slug: product.slug,
        })
      );
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: hasValidSale ? salePrice! : price,
        image: primaryImage,
        quantity: 1,
        slug: product.slug,
      })
    );

    setAddedToCart(true);
    window.setTimeout(() => setAddedToCart(false), 1800);
  };

  return (
    <article
      className="group relative flex min-w-0 flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f0ede7]">
        <Link
          href={`/product/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="absolute inset-0 block"
        >
          {primaryImage ? (
            <>
              <img
                src={primaryImage}
                alt={product.name}
                loading="lazy"
                className={cn(
                  "absolute inset-0 h-full w-full object-cover object-center",
                  "transition-all duration-700 ease-out",
                  isHovered && secondaryImage
                    ? "scale-[1.04] opacity-0"
                    : isHovered
                      ? "scale-[1.04]"
                      : "scale-100"
                )}
              />

              {secondaryImage && (
                <img
                  src={secondaryImage}
                  alt={`${product.name} alternate view`}
                  loading="lazy"
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover object-center",
                    "transition-all duration-700 ease-out",
                    isHovered
                      ? "scale-100 opacity-100"
                      : "scale-[1.04] opacity-0"
                  )}
                />
              )}
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center px-4 text-center">
              <span className="font-serif text-lg text-[#8c7b66]">
                Veloura
              </span>
            </div>
          )}
        </Link>

        {/* Product labels */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex max-w-[75%] flex-col items-start gap-1.5 sm:left-4 sm:top-4 sm:gap-2">
          {isOutOfStock ? (
            <span className="bg-[#211e1a]/85 px-2 py-1.5 text-[8px] font-medium uppercase tracking-[0.13em] text-white sm:px-3 sm:text-[9px]">
              Sold Out
            </span>
          ) : (
            <>
              {product.isNewArrival && (
                <span className="bg-[#f5f0e8] px-2 py-1.5 text-[8px] font-semibold uppercase tracking-[0.13em] text-[#211e1a] sm:px-3 sm:text-[9px]">
                  New Arrival
                </span>
              )}

              {hasValidSale && (
                <span className="bg-[#8c3f36] px-2 py-1.5 text-[8px] font-semibold uppercase tracking-[0.13em] text-white sm:px-3 sm:text-[9px]">
                  {discountPercentage}% Off
                </span>
              )}

              {!product.isNewArrival &&
                !hasValidSale &&
                product.isFlashSale && (
                  <span className="bg-[#211e1a] px-2 py-1.5 text-[8px] font-semibold uppercase tracking-[0.13em] text-white sm:px-3 sm:text-[9px]">
                    Special Edit
                  </span>
                )}
            </>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={
            inWishlist
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={inWishlist}
          className={cn(
            "absolute right-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center",
            "bg-[#faf9f6]/95 text-[#211e1a] shadow-sm backdrop-blur-sm",
            "transition-all duration-300 hover:bg-[#211e1a] hover:text-white",
            "sm:right-4 sm:top-4 sm:h-10 sm:w-10",
            inWishlist && "bg-[#211e1a] text-white"
          )}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              inWishlist && "fill-current",
              isHovered && "scale-105"
            )}
            strokeWidth={1.5}
          />
        </button>

        {/* Desktop quick actions */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 hidden p-3 sm:block sm:p-4",
            "translate-y-3 opacity-0 transition-all duration-500",
            "group-hover:translate-y-0 group-hover:opacity-100",
            "group-focus-within:translate-y-0 group-focus-within:opacity-100"
          )}
        >
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={cn(
                "flex min-h-11 flex-1 items-center justify-center gap-2 px-3",
                "bg-[#faf9f6] text-[9px] font-semibold uppercase tracking-[0.15em]",
                "text-[#211e1a] transition-colors duration-300",
                "hover:bg-[#211e1a] hover:text-white",
                "disabled:cursor-not-allowed disabled:opacity-60"
              )}
            >
              {addedToCart ? (
                <Check className="h-4 w-4" />
              ) : (
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
              )}
              <span>
                {isOutOfStock
                  ? "Sold Out"
                  : addedToCart
                    ? "Added"
                    : "Add to Bag"}
              </span>
            </button>

            <Link
              href={`/product/${product.slug}`}
              aria-label={`View ${product.name} details`}
              className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#faf9f6] text-[#211e1a] transition-colors duration-300 hover:bg-[#211e1a] hover:text-white"
            >
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>

      {/* Product information */}
      <div className="flex flex-col gap-2 pt-3.5 sm:gap-2.5 sm:pt-5">
        <Link
          href={`/product/${product.slug}`}
          className="w-fit max-w-full"
        >
          <h3 className="line-clamp-2 text-[10px] font-medium uppercase leading-relaxed tracking-[0.1em] text-[#5f5951] transition-colors hover:text-[#a88c68] sm:text-xs sm:tracking-[0.14em]">
            {product.name}
          </h3>
        </Link>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          {hasValidSale ? (
            <>
              <span className="text-xs font-semibold text-[#211e1a] sm:text-sm">
                {formatPrice(salePrice!)}
              </span>

              <span className="text-[10px] text-[#9a9288] line-through sm:text-xs">
                {formatPrice(price)}
              </span>
            </>
          ) : (
            <span className="text-xs font-semibold text-[#211e1a] sm:text-sm">
              {formatPrice(price)}
            </span>
          )}
        </div>

        {/* Mobile add-to-bag action */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={cn(
            "mt-1 flex min-h-10 w-full items-center justify-center gap-2 border px-2 py-2",
            "text-[9px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300",
            "sm:hidden",
            addedToCart
              ? "border-[#211e1a] bg-[#211e1a] text-white"
              : "border-[#d9d0c4] bg-transparent text-[#211e1a] hover:border-[#211e1a]",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          {addedToCart ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.5} />
          )}

          {isOutOfStock
            ? "Sold Out"
            : addedToCart
              ? "Added to Bag"
              : "Add to Bag"}
        </button>
      </div>
    </article>
  );
};
