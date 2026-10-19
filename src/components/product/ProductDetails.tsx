
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  Minus,
  Plus,
  Heart,
  Truck,
  RefreshCw,
  ShieldCheck,
  ChevronDown,
  Share2,
  Ruler,
  Check,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice, cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addItem } from "@/store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";

interface ProductImage {
  url: string;
  publicId?: string;
  _id?: string;
}

interface VariantSize {
  size: string;
  stock: number;
  _id?: string;
}

interface ProductColor {
  name: string;
  hex: string;
  _id?: string;
}

interface ProductVariant {
  color: ProductColor;
  images: ProductImage[];
  sizes: VariantSize[];
  _id?: string;
}

interface ProductDetailsProps {
  product: any;
}

export const ProductDetails = ({
  product,
}: ProductDetailsProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const variants: ProductVariant[] = Array.isArray(product.variants)
    ? product.variants
    : [];

  const hasVariants = variants.length > 0;

  const [selectedColor, setSelectedColor] = useState(
    variants[0]?.color?.name || product.colors?.[0]?.name || ""
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const wishlistItems = useAppSelector(
    (state) => state.wishlist.items
  );

  const isInWishlist = wishlistItems.some(
    (item: any) => item.id === product.id
  );

  const availableColors: ProductColor[] = useMemo(() => {
    if (hasVariants) {
      return variants
        .map((variant) => variant.color)
        .filter((color) => Boolean(color?.name));
    }

    return Array.isArray(product.colors) ? product.colors : [];
  }, [hasVariants, variants, product.colors]);

  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;

    return (
      variants.find(
        (variant) =>
          variant.color?.name?.toLowerCase() ===
          selectedColor?.toLowerCase()
      ) || null
    );
  }, [hasVariants, variants, selectedColor]);

  const productImages: string[] = useMemo(() => {
    const variantImages =
      selectedVariant?.images
        ?.map((image: any) =>
          typeof image === "string" ? image : image?.url
        )
        .filter(Boolean) || [];

    if (variantImages.length > 0) {
      return variantImages;
    }

    return (
      product.images
        ?.map((image: any) =>
          typeof image === "string" ? image : image?.url
        )
        .filter(Boolean) || []
    );
  }, [selectedVariant, product.images]);

  const availableSizes: VariantSize[] = useMemo(() => {
    if (hasVariants) {
      return (selectedVariant?.sizes || []).map((item: any) => ({
        ...item,
        size: item.name ?? item.size,
        stock: Number(item.stock ?? 0),
      }));
    }

    return (
      product.sizes?.map((item: any) => ({
        size: typeof item === "string" ? item : item.name ?? item.size,
        stock: Number(product.stock ?? 0),
      })) || []
    );
  }, [hasVariants, selectedVariant, product.sizes, product.stock]);

  const selectedSizeData = availableSizes.find(
    (item) => item.size === selectedSize
  );

  const selectedStock =
    selectedSizeData?.stock ??
    (availableSizes.length === 0 ? Number(product.stock ?? 0) : 0);

  const totalAvailableStock =
    availableSizes.length > 0
      ? availableSizes.reduce(
          (total, item) => total + Math.max(0, Number(item.stock || 0)),
          0
        )
      : Number(product.stock ?? 0);

  const isOutOfStock =
    availableSizes.length > 0
      ? !availableSizes.some((item) => Number(item.stock) > 0)
      : totalAvailableStock <= 0;

  const discount =
    product.salePrice && Number(product.price) > 0
      ? Math.round(
          ((Number(product.price) - Number(product.salePrice)) /
            Number(product.price)) *
            100
        )
      : 0;

  const material = product.material || "Material information coming soon.";

  const careInstructions = Array.isArray(product.careInstructions)
    ? product.careInstructions.join(". ")
    : product.careInstructions || product.care || "";

  useEffect(() => {
    setSelectedImage(0);
    setSelectedSize("");
    setQuantity(1);
    setSizeError(false);
  }, [selectedColor]);

  useEffect(() => {
    if (selectedImage >= productImages.length) {
      setSelectedImage(0);
    }
  }, [productImages, selectedImage]);

  useEffect(() => {
    if (selectedStock > 0 && quantity > selectedStock) {
      setQuantity(selectedStock);
    }
  }, [selectedStock, quantity]);

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
  };

  const changeQuantity = (amount: number) => {
    const maxQuantity =
      selectedSize && availableSizes.length > 0
        ? selectedStock
        : totalAvailableStock;

    setQuantity((current) =>
      Math.max(1, Math.min(maxQuantity || 1, current + amount))
    );
  };

  const handlePurchase = (buyNow = false) => {
    if (isOutOfStock) {
      alert("Sorry, this product is currently out of stock.");
      return;
    }

    if (availableSizes.length > 0 && !selectedSize) {
      setSizeError(true);
      return;
    }

    if (availableSizes.length > 0 && selectedStock <= 0) {
      alert("Please select an available size.");
      return;
    }

    if (productImages.length === 0) {
      alert("Product image is not available.");
      return;
    }

    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: Number(product.salePrice || product.price),
        image: productImages[selectedImage] || productImages[0],
        quantity,
        size: selectedSize,
        color: selectedColor,
        slug: product.slug,
      })
    );

    if (buyNow) {
      router.push("/checkout");
      return;
    }

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(
        addToWishlist({
          id: product.id,
          name: product.name,
          price: Number(product.salePrice || product.price),
          image: productImages[0] || "",
          slug: product.slug,
        })
      );
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Product link copied.");
      }
    } catch {
      // The user may cancel the native share dialog.
    }
  };

  return (
    <section className="mx-auto w-full max-w-[1600px] px-5 pb-16 pt-8 text-[#211e1a] sm:px-8 sm:pb-20 lg:px-16 lg:pb-24">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 xl:gap-24">
        {/* PRODUCT GALLERY */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="min-w-0"
        >
          <div className="group relative aspect-[3/4] overflow-hidden bg-[#f0eee9]">
            {productImages.length > 0 ? (
              <motion.img
                key={productImages[selectedImage]}
                src={productImages[selectedImage]}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-[#8b847a]">
                Product image coming soon
              </div>
            )}

            <div className="absolute left-4 top-4 flex flex-col gap-2 sm:left-5 sm:top-5">
              {product.isNewArrival && (
                <span className="bg-[#faf9f6] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em]">
                  New Arrival
                </span>
              )}

              {discount > 0 && (
                <span className="bg-[#211e1a] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-white">
                  {discount}% Off
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleWishlist}
              aria-label={
                isInWishlist ? "Remove from wishlist" : "Add to wishlist"
              }
              aria-pressed={isInWishlist}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#faf9f6]/95 transition hover:bg-white sm:right-5 sm:top-5"
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-colors",
                  isInWishlist
                    ? "fill-[#211e1a] text-[#211e1a]"
                    : "text-[#211e1a]"
                )}
                strokeWidth={1.5}
              />
            </button>

            {productImages.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-[#faf9f6]/95 px-3 py-2 text-[10px] tracking-[0.12em] sm:bottom-5 sm:right-5">
                {String(selectedImage + 1).padStart(2, "0")} /{" "}
                {String(productImages.length).padStart(2, "0")}
              </div>
            )}
          </div>

          {productImages.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3 sm:mt-4 sm:gap-4">
              {productImages.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  aria-label={`View product image ${index + 1}`}
                  aria-pressed={selectedImage === index}
                  className={cn(
                    "aspect-[3/4] overflow-hidden border transition",
                    selectedImage === index
                      ? "border-[#211e1a]"
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.name}, view ${index + 1}`}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 hidden items-center justify-between border-t border-[#e8e4dc] pt-4 text-[10px] uppercase tracking-[0.16em] text-[#777066] sm:flex">
            <span>Thoughtfully selected</span>
            <span>Designed for your wardrobe</span>
          </div>
        </motion.div>

        {/* PRODUCT INFORMATION */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="lg:sticky lg:top-24"
        >
          <div className="border-b border-[#e8e4dc] pb-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a7851]">
                {product.category || "The Veloura Edit"}
              </p>

              <button
                type="button"
                onClick={handleShare}
                aria-label="Share product"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e8e4dc] transition hover:border-[#211e1a]"
              >
                <Share2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <h1 className="font-serif text-3xl leading-[1.15] tracking-[-0.035em] sm:text-4xl xl:text-[46px]">
              {product.name}
            </h1>

            <a
              href="#reviews"
              className="mt-4 inline-flex items-center gap-2 text-xs text-[#777066] transition hover:text-[#211e1a]"
            >
              <span className="flex items-center gap-0.5 text-[#9a7851]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-3.5 w-3.5",
                      star <= Math.round(Number(product.rating || 0))
                        ? "fill-current"
                        : ""
                    )}
                    strokeWidth={1.3}
                  />
                ))}
              </span>

              <span>
                {Number(product.rating || 0).toFixed(1)}
                {" · "}
                {Number(product.reviewCount || product.numReviews || 0)} reviews
              </span>
            </a>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="font-serif text-2xl">
                {formatPrice(Number(product.salePrice || product.price || 0))}
              </span>

              {product.salePrice &&
                Number(product.salePrice) < Number(product.price) && (
                  <>
                    <span className="text-base text-[#9a9388] line-through">
                      {formatPrice(Number(product.price))}
                    </span>

                    {discount > 0 && (
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a7851]">
                        Save {discount}%
                      </span>
                    )}
                  </>
                )}
            </div>

            <p className="mt-2 text-[11px] text-[#777066]">
              Price inclusive of applicable taxes.
            </p>

            {product.description && (
              <p className="mt-6 text-sm leading-7 text-[#6f695f]">
                {product.description}
              </p>
            )}
          </div>

          {/* COLOR SELECTOR */}
          {availableColors.length > 0 && (
            <div className="border-b border-[#e8e4dc] py-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                  Colour
                  <span className="ml-2 font-normal normal-case tracking-normal text-[#777066]">
                    {selectedColor}
                  </span>
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {availableColors.map((color) => {
                  const isSelected =
                    selectedColor?.toLowerCase() ===
                    color.name?.toLowerCase();

                  return (
                    <button
                      key={color._id || color.name}
                      type="button"
                      title={color.name}
                      aria-label={`Select colour ${color.name}`}
                      aria-pressed={isSelected}
                      onClick={() => handleColorChange(color.name)}
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border transition",
                        isSelected
                          ? "border-[#211e1a]"
                          : "border-transparent hover:border-[#c9c1b5]"
                      )}
                    >
                      <span
                        className="h-7 w-7 rounded-full border border-black/10"
                        style={{
                          backgroundColor: color.hex || "#d8d1c5",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* SIZE SELECTOR */}
          {availableSizes.length > 0 && (
            <div className="border-b border-[#e8e4dc] py-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                  Select Size
                  {selectedSize && (
                    <span className="ml-2 font-normal text-[#777066]">
                      — {selectedSize}
                    </span>
                  )}
                </p>

                <button
                  type="button"
                  onClick={() => setGuideOpen((open) => !open)}
                  aria-expanded={guideOpen}
                  className="inline-flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#777066] underline underline-offset-4 transition hover:text-[#211e1a]"
                >
                  <Ruler className="h-3.5 w-3.5" />
                  Size Guide
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {availableSizes.map((item) => {
                  const isSelected = selectedSize === item.size;
                  const isUnavailable = Number(item.stock) <= 0;

                  return (
                    <button
                      key={item._id || item.size}
                      type="button"
                      disabled={isUnavailable}
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelectedSize(item.size);
                        setSizeError(false);
                      }}
                      className={cn(
                        "relative min-w-[52px] border px-4 py-3 text-xs transition",
                        isSelected
                          ? "border-[#211e1a] bg-[#211e1a] text-white"
                          : "border-[#ded9cf] bg-transparent hover:border-[#211e1a]",
                        isUnavailable &&
                          "cursor-not-allowed bg-[#f0eee9] text-[#aaa398] line-through opacity-70"
                      )}
                    >
                      {item.size}
                    </button>
                  );
                })}
              </div>

              {sizeError && !selectedSize && (
                <p role="alert" className="mt-3 text-xs text-red-700">
                  Please select an available size before continuing.
                </p>
              )}

              {selectedSize && selectedStock > 0 && (
                <p className="mt-3 flex items-center gap-2 text-xs text-[#657a57]">
                  <Check className="h-3.5 w-3.5" />
                  {selectedStock < 5
                    ? `Only ${selectedStock} left in this size`
                    : "Available in your selected size"}
                </p>
              )}

              {guideOpen && (
                <div className="mt-5 border border-[#e8e4dc] bg-white p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                    Size Guide
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#777066]">
                    Please check the product measurements and fit information
                    provided in the product description before selecting
                    your size.
                  </p>
                  <p className="mt-2 text-xs leading-5 text-[#777066]">
                    Need help choosing? Contact our customer support team
                    with the product name and your measurements.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STOCK STATUS */}
          <div className="py-5">
            {isOutOfStock ? (
              <p className="flex items-center gap-2 text-xs font-medium text-red-700">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                Currently out of stock
              </p>
            ) : (
              <p className="flex items-center gap-2 text-xs text-[#657a57]">
                <span className="h-2 w-2 rounded-full bg-[#657a57]" />
                In stock and ready to order
              </p>
            )}
          </div>

          {/* QUANTITY AND CART */}
          <div className="flex gap-3">
            <div className="flex h-[52px] shrink-0 items-center border border-[#ded9cf]">
              <button
                type="button"
                onClick={() => changeQuantity(-1)}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="flex h-full w-10 items-center justify-center transition hover:bg-[#f0eee9] disabled:opacity-30 sm:w-12"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <span
                className="w-7 text-center text-xs tabular-nums sm:w-8"
                aria-live="polite"
              >
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => changeQuantity(1)}
                disabled={quantity >= (selectedStock || totalAvailableStock)}
                aria-label="Increase quantity"
                className="flex h-full w-10 items-center justify-center transition hover:bg-[#f0eee9] disabled:opacity-30 sm:w-12"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => handlePurchase(false)}
              disabled={
                isOutOfStock ||
                (availableSizes.length > 0 &&
                  (!selectedSize || selectedStock <= 0))
              }
              className="flex min-h-[52px] flex-1 items-center justify-center gap-2 bg-[#211e1a] px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#40392f] disabled:cursor-not-allowed disabled:bg-[#c9c4bb] sm:text-xs sm:tracking-[0.18em]"
            >
              <span>
                {isOutOfStock
                  ? "Out of Stock"
                  : added
                    ? "Added to Bag"
                    : "Add to Bag"}
              </span>
              {added ? (
                <Check className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={() => handlePurchase(true)}
            disabled={
              isOutOfStock ||
              (availableSizes.length > 0 &&
                (!selectedSize || selectedStock <= 0))
            }
            className="mt-3 flex min-h-[52px] w-full items-center justify-center gap-2 border border-[#211e1a] bg-transparent px-4 text-[10px] font-semibold uppercase tracking-[0.18em] transition hover:bg-[#eae6de] disabled:cursor-not-allowed disabled:border-[#c9c4bb] disabled:text-[#999287] sm:text-xs"
          >
            Buy Now
          </button>

          {/* DELIVERY AND TRUST */}
          <div className="mt-7 grid grid-cols-3 border-y border-[#e8e4dc] py-5">
            <div className="flex flex-col items-center gap-2 px-2 text-center">
              <Truck className="h-5 w-5 text-[#9a7851]" strokeWidth={1.4} />
              <span className="text-[9px] leading-4 text-[#777066] sm:text-[10px]">
                Nationwide Delivery
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 border-x border-[#e8e4dc] px-2 text-center">
              <RefreshCw
                className="h-5 w-5 text-[#9a7851]"
                strokeWidth={1.4}
              />
              <span className="text-[9px] leading-4 text-[#777066] sm:text-[10px]">
                Easy Exchange
              </span>
            </div>

            <div className="flex flex-col items-center gap-2 px-2 text-center">
              <ShieldCheck
                className="h-5 w-5 text-[#9a7851]"
                strokeWidth={1.4}
              />
              <span className="text-[9px] leading-4 text-[#777066] sm:text-[10px]">
                Secure Checkout
              </span>
            </div>
          </div>

          {/* PRODUCT INFORMATION */}
          <div className="mt-3 divide-y divide-[#e8e4dc] border-b border-[#e8e4dc]">
            {[
              {
                title: "Product Description",
                content: product.description || "No description available.",
              },
              {
                title: "Material & Care",
                content: [material, careInstructions]
                  .filter(Boolean)
                  .join(". "),
              },
              {
                title: "Shipping & Exchange",
                content:
                  "Delivery availability and exchange eligibility are subject to the store's current shipping and exchange policies. Please review the relevant policy before placing your order.",
              },
            ].map((item) => (
              <details key={item.title} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                    {item.title}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#777066] transition-transform group-open:rotate-180" />
                </summary>

                <div className="pb-5 text-sm leading-7 text-[#777066]">
                  {item.content || "No additional information available."}
                </div>
              </details>
            ))}
          </div>

          <p className="mt-5 text-center text-[10px] uppercase tracking-[0.14em] text-[#918a7f]">
            A little something special, chosen for you.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
