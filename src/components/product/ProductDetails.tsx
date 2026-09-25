"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Star,
  Minus,
  Plus,
  Heart,
  Truck,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
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

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const dispatch = useAppDispatch();

  /*
  |--------------------------------------------------------------------------
  | Normalize product data
  |--------------------------------------------------------------------------
  */

  const variants: ProductVariant[] = Array.isArray(product.variants)
    ? product.variants
    : [];

  const hasVariants = variants.length > 0;

  /*
  |--------------------------------------------------------------------------
  | Selected color
  |--------------------------------------------------------------------------
  */

  const [selectedColor, setSelectedColor] = useState(
    hasVariants
      ? variants[0]?.color?.name || ""
      : product.colors?.[0]?.name || ""
  );

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  /*
  |--------------------------------------------------------------------------
  | Find selected variant
  |--------------------------------------------------------------------------
  */

  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;

    return (
      variants.find(
        (variant) =>
          variant.color?.name?.toLowerCase() ===
          selectedColor?.toLowerCase()
      ) || null
    );
  }, [variants, selectedColor, hasVariants]);

  /*
  |--------------------------------------------------------------------------
  | Images
  |--------------------------------------------------------------------------
  |
  | If variants exist:
  |     selected color images
  |
  | Otherwise:
  |     old product.images
  |
  */

  const productImages: string[] = useMemo(() => {
    if (hasVariants) {
      const variantImages =
        selectedVariant?.images
          ?.map((image) =>
            typeof image === "string" ? image : image?.url
          )
          .filter(Boolean) || [];

      if (variantImages.length > 0) {
        return variantImages;
      }
    }

    return (
      product.images
        ?.map((image: any) =>
          typeof image === "string" ? image : image?.url
        )
        .filter(Boolean) || []
    );
  }, [hasVariants, selectedVariant, product.images]);

  /*
  |--------------------------------------------------------------------------
  | Available sizes
  |--------------------------------------------------------------------------
  */

  const availableSizes: VariantSize[] = useMemo(() => {
    if (hasVariants) {
      return selectedVariant?.sizes || [];
    }

    return (
      product.sizes?.map((size: string) => ({
        size,
        stock: Number(product.stock || 0),
      })) || []
    );
  }, [hasVariants, selectedVariant, product.sizes, product.stock]);

  /*
  |--------------------------------------------------------------------------
  | Colors
  |--------------------------------------------------------------------------
  |
  | Prefer variants.
  | Fallback to old product.colors.
  |
  */

  const availableColors: ProductColor[] = useMemo(() => {
    if (hasVariants) {
      return variants
        .map((variant) => variant.color)
        .filter(Boolean);
    }

    return product.colors || [];
  }, [hasVariants, variants, product.colors]);

  /*
  |--------------------------------------------------------------------------
  | Wishlist
  |--------------------------------------------------------------------------
  */

  const wishlistItems = useAppSelector(
    (state) => state.wishlist.items
  );

  const isInWishlist = wishlistItems.some(
    (item) => item.id === product.id
  );

  /*
  |--------------------------------------------------------------------------
  | Reset image and size when color changes
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setSelectedImage(0);
    setSelectedSize("");
    setQuantity(1);
  }, [selectedColor]);

  /*
  |--------------------------------------------------------------------------
  | Keep selected image valid
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (selectedImage >= productImages.length) {
      setSelectedImage(0);
    }
  }, [productImages, selectedImage]);

  /*
  |--------------------------------------------------------------------------
  | Selected size stock
  |--------------------------------------------------------------------------
  */

  const selectedSizeData = availableSizes.find(
    (item) => item.size === selectedSize
  );

  const selectedStock = selectedSizeData?.stock ?? 0;

  /*
  |--------------------------------------------------------------------------
  | Maximum quantity
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (selectedStock > 0 && quantity > selectedStock) {
      setQuantity(selectedStock);
    }
  }, [selectedStock, quantity]);

  /*
  |--------------------------------------------------------------------------
  | Add to cart
  |--------------------------------------------------------------------------
  */

  const handleAddToCart = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      alert("Please select a size");
      return;
    }

    if (
      availableSizes.length > 0 &&
      selectedSize &&
      selectedStock <= 0
    ) {
      alert("This size is out of stock");
      return;
    }

    if (productImages.length === 0) {
      alert("Product image is not available");
      return;
    }

    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: Number(product.salePrice || product.price),
        image: productImages[0],
        quantity,
        size: selectedSize,
        color: selectedColor,
        slug: product.slug,
      })
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Color change
  |--------------------------------------------------------------------------
  */

  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
  };

  /*
  |--------------------------------------------------------------------------
  | Quantity
  |--------------------------------------------------------------------------
  */

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    if (selectedStock > 0) {
      setQuantity((current) =>
        Math.min(selectedStock, current + 1)
      );
      return;
    }

    setQuantity((current) => current + 1);
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
      {/* =========================================================
          GALLERY
      ========================================================== */}

      <div className="flex flex-col gap-4">
        <div className="aspect-[3/4] overflow-hidden bg-gray-100">
          {productImages.length > 0 ? (
            <motion.img
              key={productImages[selectedImage]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
              No image available
            </div>
          )}
        </div>

        {productImages.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {productImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "aspect-[3/4] border-2 transition-all overflow-hidden",
                  selectedImage === index
                    ? "border-black"
                    : "border-transparent"
                )}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================
          PRODUCT INFO
      ========================================================== */}

      <div className="flex flex-col">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={cn(
                    "w-4 h-4 fill-current",
                    index >= Math.floor(product.rating || 0) &&
                      "text-gray-200 fill-none"
                  )}
                />
              ))}
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              {product.reviewCount || 0} Reviews
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            {product.salePrice ? (
              <>
                <span className="text-3xl font-bold">
                  {formatPrice(product.salePrice)}
                </span>

                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.price)}
                </span>

                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                  Save{" "}
                  {Math.round(
                    ((product.price - product.salePrice) /
                      product.price) *
                      100
                  )}
                  %
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>

        {/* =========================================================
            OPTIONS
        ========================================================== */}

        <div className="flex flex-col gap-8 mb-10 pb-10 border-b border-gray-100">
          {/* =====================================================
              COLORS
          ====================================================== */}

          {availableColors.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                Color:{" "}
                <span className="text-gray-500">
                  {selectedColor || "Select Color"}
                </span>
              </h4>

              <div className="flex flex-wrap gap-4">
                {availableColors.map((color) => {
                  const isSelected =
                    selectedColor?.toLowerCase() ===
                    color.name?.toLowerCase();

                  return (
                    <button
                      key={color._id || color.name}
                      type="button"
                      title={color.name}
                      onClick={() =>
                        handleColorChange(color.name)
                      }
                      className={cn(
                        "w-9 h-9 rounded-full border border-gray-200 p-1 transition-all",
                        isSelected
                          ? "ring-1 ring-black ring-offset-2"
                          : "hover:ring-1 hover:ring-gray-300"
                      )}
                    >
                      <div
                        className="w-full h-full rounded-full"
                        style={{
                          backgroundColor:
                            color.hex || "#000000",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =====================================================
              SIZES
          ====================================================== */}

          {availableSizes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  Size:{" "}
                  <span className="text-gray-500">
                    {selectedSize || "Select Size"}
                  </span>
                </h4>

                <button
                  type="button"
                  className="text-[10px] font-bold uppercase tracking-[0.2em] underline"
                >
                  Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableSizes.map((sizeItem) => {
                  const isSelected =
                    selectedSize === sizeItem.size;

                  const isOutOfStock =
                    Number(sizeItem.stock) <= 0;

                  return (
                    <button
                      key={sizeItem._id || sizeItem.size}
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() =>
                        setSelectedSize(sizeItem.size)
                      }
                      className={cn(
                        "relative min-w-[50px] px-4 py-3 text-[10px] font-bold uppercase tracking-widest border transition-all",
                        isSelected
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-200 hover:border-black",
                        isOutOfStock &&
                          "opacity-40 cursor-not-allowed line-through hover:border-gray-200"
                      )}
                    >
                      {sizeItem.size}

                      {isOutOfStock && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-full h-px bg-gray-400 rotate-[-25deg]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Stock message */}
              {selectedSize && selectedStock > 0 && (
                <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-green-600">
                  {selectedStock} available
                </p>
              )}

              {selectedSize && selectedStock <= 0 && (
                <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-red-600">
                  Out of stock
                </p>
              )}
            </div>
          )}

          {/* =====================================================
              QUANTITY + CART
          ====================================================== */}

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Quantity */}
            <div className="flex items-center border border-gray-200">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="p-4 hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="w-12 text-center text-sm font-bold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={
                  selectedStock > 0 &&
                  quantity >= selectedStock
                }
                className="p-4 hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={
                availableSizes.length > 0 &&
                (!selectedSize || selectedStock <= 0)
              }
              className={cn(
                "flex-1 text-white text-xs font-bold uppercase tracking-widest py-4 transition-colors",
                availableSizes.length > 0 &&
                  (!selectedSize || selectedStock <= 0)
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-black hover:bg-gray-800"
              )}
            >
              {availableSizes.length > 0 &&
              selectedSize &&
              selectedStock <= 0
                ? "Out of Stock"
                : "Add to Cart"}
            </button>

            {/* Wishlist */}
            <button
              type="button"
              onClick={() => {
                if (isInWishlist) {
                  dispatch(removeFromWishlist(product.id));
                } else {
                  dispatch(
                    addToWishlist({
                      id: product.id,
                      name: product.name,
                      price: Number(
                        product.salePrice || product.price
                      ),
                      image: productImages[0] || "",
                      slug: product.slug,
                    })
                  );
                }
              }}
              className="p-4 border border-gray-200 hover:border-black transition-colors"
            >
              <Heart
                className={cn(
                  "w-5 h-5",
                  isInWishlist && "fill-black"
                )}
              />
            </button>
          </div>

          {/* Buy Now */}
          <button
            type="button"
            className="w-full py-4 bg-[#5a31f4] text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Buy It Now
          </button>
        </div>

        {/* =========================================================
            BENEFITS
        ========================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="flex flex-col items-center text-center gap-2">
            <Truck className="w-5 h-5 text-gray-400" />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              Fast Delivery
            </span>
          </div>

          <div className="flex flex-col items-center text-center gap-2">
            <RefreshCw className="w-5 h-5 text-gray-400" />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              Exchange Only
            </span>
          </div>

          <div className="flex flex-col items-center text-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gray-400" />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              Secure Checkout
            </span>
          </div>
        </div>

        {/* =========================================================
            ACCORDIONS
        ========================================================== */}

        <div className="divide-y divide-gray-100 border-t border-gray-100">
          {[
            {
              title: "Description",
              content: product.description,
            },
            {
              title: "Material & Care",
              content: [
                product.material,
                product.careInstructions,
              ]
                .filter(Boolean)
                .join(". "),
            },
            {
              title: "Shipping & Returns",
              content:
                "Orders are shipped within 2-3 business days. We offer exchange only policy within 7 days.",
            },
          ].map((item, index) => (
            <details
              key={index}
              className="group py-4"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-xs font-bold uppercase tracking-widest">
                  {item.title}
                </span>

                <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
              </summary>

              <div className="mt-4 text-sm text-gray-500 leading-relaxed">
                {item.content || "No information available."}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

