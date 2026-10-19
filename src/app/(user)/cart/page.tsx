"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeItem,
  updateQuantity,
  clearCart,
} from "@/store/slices/cartSlice";
import { formatPrice, cn } from "@/lib/utils";
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const FREE_SHIPPING_THRESHOLD = 5000;

export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);

  const total = items.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  const totalItems = items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - total
  );

  const shippingProgress = Math.min(
    100,
    (total / FREE_SHIPPING_THRESHOLD) * 100
  );

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#211e1a]">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mb-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#918b82]"
        >
          <Link
            href="/"
            className="transition-colors hover:text-[#a88c68]"
          >
            Home
          </Link>

          <ChevronRight className="h-3 w-3" />

          <span className="text-[#211e1a]">Shopping Bag</span>
        </nav>

        {/* Page Heading */}
        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 border-b border-[#e9e5de] pb-8 sm:mb-14 sm:pb-10"
        >
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-[#a88c68]" />

            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#a88c68]">
              Your Selection
            </p>
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h1 className="font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
              Shopping Bag
            </h1>

            {items.length > 0 && (
              <p className="text-xs tracking-wide text-[#817b72]">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your bag
              </p>
            )}
          </div>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#817b72]">
            Thoughtfully chosen pieces, just for you. Review your selection
            before proceeding to checkout.
          </p>
        </motion.header>

        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            /* Empty Cart */
            <motion.section
              key="empty-cart"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mx-auto flex max-w-xl flex-col items-center py-12 text-center sm:py-20"
            >
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full border border-[#e9e5de] bg-white">
                <ShoppingBag className="h-9 w-9 stroke-[1.1] text-[#a88c68]" />
              </div>

              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.25em] text-[#a88c68]">
                Nothing here just yet
              </p>

              <h2 className="font-serif text-3xl sm:text-4xl">
                Your bag is waiting.
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-7 text-[#817b72]">
                Discover pieces designed to make everyday dressing feel
                extraordinary. Your next favourite may be just around the
                corner.
              </p>

              <Link
                href="/shop"
                className="group mt-9 inline-flex min-h-14 items-center justify-center gap-3 bg-[#211e1a] px-9 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-colors duration-300 hover:bg-[#a88c68]"
              >
                <ShoppingBag className="h-4 w-4" />
                Explore the Collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/"
                className="mt-6 text-[10px] uppercase tracking-[0.18em] text-[#817b72] underline underline-offset-4 transition-colors hover:text-[#211e1a]"
              >
                Return Home
              </Link>
            </motion.section>
          ) : (
            /* Populated Cart */
            <motion.div
              key="populated-cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12"
            >
              {/* Cart Items */}
              <section className="lg:col-span-8">
                <div className="mb-5 hidden grid-cols-12 border-b border-[#e9e5de] pb-4 text-[9px] font-medium uppercase tracking-[0.2em] text-[#918b82] md:grid">
                  <div className="col-span-6">Product Details</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                </div>

                <div className="divide-y divide-[#e9e5de]">
                  {items.map((item, index) => (
                    <motion.article
                      layout
                      key={`${item.id}-${item.size}-${item.color}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{
                        duration: 0.25,
                        delay: Math.min(index * 0.05, 0.2),
                      }}
                      className="grid grid-cols-1 gap-5 py-6 sm:py-8 md:grid-cols-12 md:items-center md:gap-3"
                    >
                      {/* Product Information */}
                      <div className="flex gap-4 sm:gap-5 md:col-span-6">
                        <Link
                          href={`/product/${item.slug}`}
                          className="relative block w-[104px] shrink-0 overflow-hidden bg-[#f0ede7] sm:w-[124px]"
                        >
                          <div className="aspect-[3/4]">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="(max-width: 640px) 104px, 124px"
                                className="object-cover transition-transform duration-700 hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full min-h-32 items-center justify-center">
                                <ShoppingBag className="h-7 w-7 text-[#c5b9a8]" />
                              </div>
                            )}
                          </div>
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
                          <p className="mb-2 text-[9px] uppercase tracking-[0.2em] text-[#a88c68]">
                            Veloura Collection
                          </p>

                          <Link
                            href={`/product/${item.slug}`}
                            className="line-clamp-2 font-serif text-base leading-snug transition-colors hover:text-[#a88c68] sm:text-lg"
                          >
                            {item.name}
                          </Link>

                          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.12em] text-[#817b72]">
                            {item.size && (
                              <span>
                                Size:{" "}
                                <span className="text-[#211e1a]">
                                  {item.size}
                                </span>
                              </span>
                            )}

                            {item.size && item.color && (
                              <span className="h-3 w-px bg-[#d8d1c7]" />
                            )}

                            {item.color && (
                              <span>
                                Color:{" "}
                                <span className="text-[#211e1a]">
                                  {item.color}
                                </span>
                              </span>
                            )}
                          </div>

                          <p className="mt-3 text-xs font-medium text-[#211e1a] md:hidden">
                            {formatPrice(item.price)}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              dispatch(
                                removeItem({
                                  id: item.id,
                                  size: item.size,
                                  color: item.color,
                                })
                              )
                            }
                            aria-label={`Remove ${item.name} from bag`}
                            className="mt-4 flex w-fit items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-[#918b82] transition-colors hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Desktop Unit Price */}
                      <div className="hidden text-center text-xs md:col-span-2 md:block">
                        {formatPrice(item.price)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between md:col-span-2 md:justify-center">
                        <span className="text-[9px] uppercase tracking-[0.15em] text-[#918b82] md:hidden">
                          Quantity
                        </span>

                        <div className="flex h-10 items-center border border-[#ded8cf] bg-white">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.name}`}
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  id: item.id,
                                  quantity: item.quantity - 1,
                                  size: item.size,
                                  color: item.color,
                                })
                              )
                            }
                            className="flex h-full w-9 items-center justify-center transition-colors hover:bg-[#f0ede7] disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Minus className="h-3 w-3" />
                          </button>

                          <span
                            aria-live="polite"
                            className="w-8 text-center text-xs tabular-nums"
                          >
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.name}`}
                            onClick={() =>
                              dispatch(
                                updateQuantity({
                                  id: item.id,
                                  quantity: item.quantity + 1,
                                  size: item.size,
                                  color: item.color,
                                })
                              )
                            }
                            className="flex h-full w-9 items-center justify-center transition-colors hover:bg-[#f0ede7]"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Line Total */}
                      <div className="flex items-center justify-between border-t border-dashed border-[#e9e5de] pt-4 md:col-span-2 md:justify-end md:border-0 md:pt-0">
                        <span className="text-[9px] uppercase tracking-[0.15em] text-[#918b82] md:hidden">
                          Subtotal
                        </span>

                        <span className="text-sm font-medium tabular-nums">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </motion.article>
                  ))}
                </div>

                {/* Cart Actions */}
                <div className="flex flex-col gap-5 border-t border-[#e9e5de] pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href="/shop"
                    className="group inline-flex w-fit items-center gap-2 text-[10px] font-medium uppercase tracking-[0.17em] text-[#5f5951] transition-colors hover:text-[#a88c68]"
                  >
                    <ArrowRight className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
                    Continue Shopping
                  </Link>

                  <button
                    type="button"
                    onClick={() => dispatch(clearCart())}
                    className="inline-flex w-fit items-center gap-2 text-[10px] uppercase tracking-[0.17em] text-[#918b82] transition-colors hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Clear Shopping Bag
                  </button>
                </div>

                {/* Trust Features */}
                <div className="mt-10 grid grid-cols-1 gap-5 border-t border-[#e9e5de] pt-7 sm:grid-cols-3 sm:gap-4">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 shrink-0 stroke-[1.3] text-[#a88c68]" />
                    <div>
                      <p className="text-[9px] font-medium uppercase tracking-[0.12em]">
                        Thoughtful Delivery
                      </p>
                      <p className="mt-1 text-[10px] text-[#918b82]">
                        Shipping calculated at checkout
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 shrink-0 stroke-[1.3] text-[#a88c68]" />
                    <div>
                      <p className="text-[9px] font-medium uppercase tracking-[0.12em]">
                        Secure Checkout
                      </p>
                      <p className="mt-1 text-[10px] text-[#918b82]">
                        A protected shopping experience
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <RotateCcw className="h-5 w-5 shrink-0 stroke-[1.3] text-[#a88c68]" />
                    <div>
                      <p className="text-[9px] font-medium uppercase tracking-[0.12em]">
                        Easy Exchanges
                      </p>
                      <p className="mt-1 text-[10px] text-[#918b82]">
                        Exchange within 7 days
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Order Summary */}
              <aside className="lg:sticky lg:top-28 lg:col-span-4">
                <div className="border border-[#e9e5de] bg-white p-6 sm:p-8">
                  <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.22em] text-[#a88c68]">
                    Almost Yours
                  </p>

                  <h2 className="font-serif text-2xl sm:text-3xl">
                    Order Summary
                  </h2>

                  <p className="mt-3 text-xs leading-6 text-[#817b72]">
                    Review your order details before continuing to checkout.
                  </p>

                  <div className="my-7 h-px bg-[#e9e5de]" />

                  {/* Shipping Progress */}
                  <div className="mb-7">
                    {remainingForFreeShipping > 0 ? (
                      <p className="text-xs leading-6 text-[#5f5951]">
                        You&apos;re{" "}
                        <span className="font-semibold text-[#211e1a]">
                          {formatPrice(remainingForFreeShipping)}
                        </span>{" "}
                        away from free shipping.
                      </p>
                    ) : (
                      <p className="text-xs leading-6 text-[#5f5951]">
                        You&apos;ve unlocked{" "}
                        <span className="font-semibold text-[#a88c68]">
                          free shipping!
                        </span>
                      </p>
                    )}

                    <div
                      className="mt-3 h-1 w-full overflow-hidden bg-[#eeeae3]"
                      role="progressbar"
                      aria-label="Free shipping progress"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(shippingProgress)}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${shippingProgress}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="h-full bg-[#a88c68]"
                      />
                    </div>

                    <p className="mt-2 text-[9px] uppercase tracking-[0.12em] text-[#a39c92]">
                      Free shipping on orders of PKR 5,000 or more
                    </p>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[#817b72]">
                        Subtotal ({totalItems}{" "}
                        {totalItems === 1 ? "item" : "items"})
                      </span>

                      <span className="font-medium tabular-nums">
                        {formatPrice(total)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[#817b72]">Shipping</span>

                      <span className="font-medium">
                        {total >= FREE_SHIPPING_THRESHOLD
                          ? "FREE"
                          : "At checkout"}
                      </span>
                    </div>
                  </div>

                  <div className="my-6 h-px bg-[#e9e5de]" />

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.15em]">
                        Estimated Total
                      </p>

                      <p className="mt-2 text-[9px] leading-5 text-[#a39c92]">
                        Shipping confirmed at checkout.
                      </p>
                    </div>

                    <p className="font-serif text-xl tabular-nums sm:text-2xl">
                      {formatPrice(total)}
                    </p>
                  </div>

                  <Link
                    href="/checkout"
                    className="group mt-7 flex min-h-14 w-full items-center justify-center gap-3 bg-[#211e1a] px-5 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-[#a88c68]"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <div className="mt-5 flex items-start justify-center gap-2 text-center">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#a88c68]" />

                    <p className="text-[9px] leading-5 text-[#918b82]">
                      Your details are handled with care at checkout.
                    </p>
                  </div>

                  {/* Payment Methods */}
                  <div className="mt-6 border-t border-[#e9e5de] pt-5">
                    <p className="mb-3 text-center text-[9px] uppercase tracking-[0.16em] text-[#918b82]">
                      Payment options
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {["JazzCash", "Easypaisa", "Cash on Delivery"].map(
                        (method) => (
                          <span
                            key={method}
                            className="border border-[#e9e5de] bg-[#faf9f6] px-2.5 py-2 text-[8px] uppercase tracking-[0.08em] text-[#5f5951]"
                          >
                            {method}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <Link
                  href="/shop"
                  className="mt-5 flex items-center justify-center gap-2 py-3 text-[9px] uppercase tracking-[0.16em] text-[#817b72] transition-colors hover:text-[#a88c68]"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  Discover more from Veloura
                </Link>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
