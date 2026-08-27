"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  setCartOpen,
  setSearchOpen,
  setMobileMenuOpen,
} from "@/store/slices/uiSlice";

import { performLogout } from "@/store/slices/authSlice";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchModal } from "@/components/layout/SearchModal";

/* -------------------------------------------------------------------------- */
/*                              Announcement Bar                              */
/* -------------------------------------------------------------------------- */

const ANNOUNCEMENTS = [
  "Free delivery on orders over Rs. 5,000",
  "New collection is now available",
  "Secure payments • Easy returns",
];

function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % ANNOUNCEMENTS.length);
    }, 4200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-9 overflow-hidden bg-black text-white">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 flex items-center justify-center px-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em]"
        >
          {ANNOUNCEMENTS[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Nav Links                                 */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Shop",
    href: "/shop",
    children: [
      {
        name: "New Arrivals",
        href: "/shop?category=new-arrivals",
      },
      {
        name: "Western Wear",
        href: "/shop?category=western-wear",
      },
      {
        name: "Undergarments",
        href: "/shop?category=undergarments",
      },
      {
        name: "Flash Sale",
        href: "/shop?category=flash-sale",
      },
    ],
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Blog",
    href: "/blog",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

/* -------------------------------------------------------------------------- */
/*                                Mega Menu                                   */
/* -------------------------------------------------------------------------- */

function MegaMenu({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
      className="absolute left-0 right-0 top-full z-[55] hidden border-b border-gray-200 bg-white shadow-xl lg:block"
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-3 gap-12 px-10 py-10">
        {/* Categories */}
        <div>
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
            Shop Collection
          </p>

          <div className="space-y-4">
            <Link
              href="/shop"
              onClick={onClose}
              className="block font-serif text-2xl transition-colors hover:text-gray-500"
            >
              View All
            </Link>

            <Link
              href="/shop?category=new-arrivals"
              onClick={onClose}
              className="block text-sm uppercase tracking-widest transition-colors hover:text-gray-500"
            >
              New Arrivals
            </Link>

            <Link
              href="/shop?category=western-wear"
              onClick={onClose}
              className="block text-sm uppercase tracking-widest transition-colors hover:text-gray-500"
            >
              Western Wear
            </Link>

            <Link
              href="/shop?category=undergarments"
              onClick={onClose}
              className="block text-sm uppercase tracking-widest transition-colors hover:text-gray-500"
            >
              Undergarments
            </Link>

            <Link
              href="/shop?category=flash-sale"
              onClick={onClose}
              className="block text-sm font-bold uppercase tracking-widest text-red-600"
            >
              Flash Sale
            </Link>
          </div>
        </div>

        {/* Featured */}
        <div>
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
            Featured
          </p>

          <div className="space-y-5">
            <Link
              href="/shop?category=new-arrivals"
              onClick={onClose}
              className="group block"
            >
              <div className="overflow-hidden bg-gray-100">
                <div className="flex h-32 items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
                  <span className="font-serif text-3xl text-gray-500">
                    New Collection
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs font-bold uppercase tracking-widest">
                New Arrivals →
              </p>
            </Link>
          </div>
        </div>

        {/* Sale */}
        <div className="relative overflow-hidden bg-black p-8 text-white">
          <div className="flex h-full flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
                Limited Time
              </p>

              <h3 className="mt-4 font-serif text-4xl">
                Flash Sale
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-300">
                Discover selected styles at exclusive prices.
              </p>
            </div>

            <Link
              href="/shop?category=flash-sale"
              onClick={onClose}
              className="mt-8 inline-block border-b border-white pb-1 text-xs font-bold uppercase tracking-widest"
            >
              Shop Sale →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Header                                   */
/* -------------------------------------------------------------------------- */

export const Header = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [megaMenu, setMegaMenu] = useState(false);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    isCartOpen,
    isSearchOpen,
    isMobileMenuOpen,
  } = useAppSelector((state) => state.ui);

  const cartItems = useAppSelector(
    (state) => state.cart.items
  );

  const wishlistItems = useAppSelector(
    (state) => state.wishlist.items
  );

  const user = useAppSelector(
    (state) => state.auth.user
  );

  /* ------------------------------- Scroll -------------------------------- */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* ------------------------------ Mega Menu ------------------------------- */

  const openMega = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }

    setMegaMenu(true);
  };

  const closeMega = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }

    closeTimer.current = setTimeout(() => {
      setMegaMenu(false);
    }, 150);
  };

  /* -------------------------------- Logout -------------------------------- */

  const handleLogout = () => {
    dispatch(performLogout());
  };

  /* ------------------------------ Cart Count ------------------------------ */

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const wishlistCount = wishlistItems.length;

  /* -------------------------------- Styles -------------------------------- */

  const iconButton =
    "relative flex h-10 w-10 items-center justify-center text-black transition-colors hover:text-gray-500";

  const countBadge = (count: number) => {
    if (count <= 0) return null;

    return (
      <span className="absolute -right-0.5 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[9px] font-bold text-white">
        {count}
      </span>
    );
  };

  return (
    <>
      {/* ================================================================== */}
      {/* Header                                                             */}
      {/* ================================================================== */}

      <header className="fixed inset-x-0 top-0 z-50">
        {/* Announcement */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-500",
            scrolled ? "max-h-0" : "max-h-9"
          )}
        >
          <AnnouncementBar />
        </div>

        {/* Main Header */}
        <div
          className={cn(
            "border-b transition-all duration-500",
            scrolled
              ? "border-gray-200 bg-white/95 shadow-sm backdrop-blur-md"
              : "border-transparent bg-white"
          )}
        >
          <div className="mx-auto max-w-[1440px] px-5 md:px-10">
            <div
              className={cn(
                "grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-500",
                scrolled ? "h-14" : "h-[72px]"
              )}
            >
              {/* ========================================================== */}
              {/* Left                                                        */}
              {/* ========================================================== */}

              <div className="flex items-center">
                {/* Mobile menu */}
                <button
                  className={cn(iconButton, "lg:hidden")}
                  aria-label="Open menu"
                  aria-expanded={isMobileMenuOpen}
                  onClick={() =>
                    dispatch(setMobileMenuOpen(true))
                  }
                >
                  <Menu className="h-5 w-5" />
                </button>

                {/* Desktop quick links */}
                <div className="hidden items-center gap-6 lg:flex">
                  <Link
                    href="/shop?category=new-arrivals"
                    className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600 transition-colors hover:text-black"
                  >
                    New In
                  </Link>

                  <Link
                    href="/shop?category=flash-sale"
                    className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-600 transition-colors hover:text-red-700"
                  >
                    Sale
                  </Link>
                </div>
              </div>

              {/* ========================================================== */}
              {/* Logo                                                        */}
              {/* ========================================================== */}

              <Link
                href="/"
                className="flex flex-col items-center leading-none"
                aria-label="Elegance Home"
              >
                <span
                  className={cn(
                    "font-serif font-medium uppercase tracking-[0.28em] transition-all duration-500",
                    scrolled
                      ? "text-xl"
                      : "text-2xl md:text-3xl"
                  )}
                >
                  ELEGANCE
                </span>

                <span className="mt-1 hidden text-[7px] font-bold uppercase tracking-[0.45em] text-gray-400 md:block">
                  Atelier · Pakistan
                </span>
              </Link>

              {/* ========================================================== */}
              {/* Right                                                        */}
              {/* ========================================================== */}

              <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                {/* Search */}
                <button
                  className={iconButton}
                  aria-label="Search"
                  onClick={() =>
                    dispatch(setSearchOpen(true))
                  }
                >
                  <Search className="h-[19px] w-[19px]" />
                </button>

                {/* Account */}
                {user ? (
                  <>
                    <Link
                      href="/account"
                      className={cn(
                        iconButton,
                        "hidden sm:flex"
                      )}
                      aria-label="Account"
                    >
                      <User className="h-[19px] w-[19px]" />
                    </Link>

                    <button
                      onClick={handleLogout}
                      className={cn(
                        iconButton,
                        "hidden sm:flex"
                      )}
                      aria-label="Logout"
                    >
                      <LogOut className="h-[18px] w-[18px]" />
                    </button>
                  </>
                ) : (
                  <Link
                    href="/account/login"
                    className={cn(
                      iconButton,
                      "hidden sm:flex"
                    )}
                    aria-label="Login"
                  >
                    <User className="h-[19px] w-[19px]" />
                  </Link>
                )}

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  className={iconButton}
                  aria-label={`Wishlist, ${wishlistCount} items`}
                >
                  <Heart
                    className={cn(
                      "h-[19px] w-[19px]",
                      wishlistCount > 0 &&
                        "fill-black"
                    )}
                  />

                  {countBadge(wishlistCount)}
                </Link>

                {/* Cart */}
                <button
                  className={iconButton}
                  aria-label={`Shopping bag, ${cartCount} items`}
                  onClick={() =>
                    dispatch(setCartOpen(true))
                  }
                >
                  <ShoppingBag className="h-[19px] w-[19px]" />

                  {countBadge(cartCount)}
                </button>
              </div>
            </div>

            {/* ============================================================ */}
            {/* Desktop Navigation                                            */}
            {/* ============================================================ */}

            <nav
              aria-label="Main navigation"
              className={cn(
                "hidden items-center justify-center gap-8 overflow-hidden transition-all duration-500 lg:flex",
                scrolled
                  ? "max-h-0 opacity-0"
                  : "max-h-14 py-3"
              )}
            >
              {NAV_LINKS.map((link) => {
                const hasChildren =
                  !!link.children;

                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={
                      hasChildren
                        ? openMega
                        : undefined
                    }
                    onMouseLeave={
                      hasChildren
                        ? closeMega
                        : undefined
                    }
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center gap-1 px-1 py-1 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors",
                        pathname === link.href
                          ? "text-black"
                          : "text-gray-600 hover:text-black"
                      )}
                    >
                      {link.name}

                      {hasChildren && (
                        <ChevronDown
                          className={cn(
                            "h-3 w-3 transition-transform",
                            megaMenu &&
                              link.name ===
                                "Shop" &&
                              "rotate-180"
                          )}
                        />
                      )}
                    </Link>

                    <span
                      className={cn(
                        "absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-black transition-transform duration-300",
                        pathname === link.href &&
                          "scale-x-100"
                      )}
                    />

                    {/* Mega menu only for Shop */}
                    {link.name === "Shop" && (
                      <AnimatePresence>
                        {megaMenu && (
                          <MegaMenu
                            onClose={() =>
                              setMegaMenu(false)
                            }
                          />
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Header spacer */}
      <div
        className="h-[108px] lg:h-[157px]"
        aria-hidden
      />

      {/* ================================================================== */}
      {/* Cart / Search                                                      */}
      {/* ================================================================== */}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() =>
          dispatch(setCartOpen(false))
        }
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() =>
          dispatch(setSearchOpen(false))
        }
      />

      {/* ================================================================== */}
      {/* Mobile Menu                                                        */}
      {/* ================================================================== */}

      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            onClose={() =>
              dispatch(setMobileMenuOpen(false))
            }
          />
        )}
      </AnimatePresence>
    </>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Mobile Menu                                   */
/* -------------------------------------------------------------------------- */

function MobileMenu({
  onClose,
}: {
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const reduceMotion = useReducedMotion();

  const [expanded, setExpanded] = useState<
    string | null
  >(null);

  const wishlistCount = useAppSelector(
    (state) => state.wishlist.items.length
  );

  const cartCount = useAppSelector(
    (state) =>
      state.cart.items.reduce(
        (total, item) =>
          total + item.quantity,
        0
      )
  );

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/50"
      />

      {/* Drawer */}
      <motion.aside
        initial={
          reduceMotion
            ? false
            : { x: "-100%" }
        }
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{
          type: "spring",
          damping: 28,
          stiffness: 220,
        }}
        className="fixed left-0 top-0 z-[70] flex h-full w-full max-w-[350px] flex-col bg-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <span className="font-serif text-xl uppercase tracking-[0.25em]">
            ELEGANCE
          </span>

          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-6 py-5">
          <ul>
            {/* Home */}
            <li>
              <Link
                href="/"
                onClick={onClose}
                className="block border-b border-gray-100 py-4 font-serif text-xl"
              >
                Home
              </Link>
            </li>

            {/* Shop */}
            <li className="border-b border-gray-100">
              <button
                className="flex w-full items-center justify-between py-4 font-serif text-xl"
                onClick={() =>
                  setExpanded(
                    expanded === "shop"
                      ? null
                      : "shop"
                  )
                }
                aria-expanded={
                  expanded === "shop"
                }
              >
                Shop

                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expanded === "shop" &&
                      "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {expanded === "shop" && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1 pb-4 pl-4">
                      <Link
                        href="/shop"
                        onClick={onClose}
                        className="block py-2 text-sm uppercase tracking-wider text-gray-600"
                      >
                        View All
                      </Link>

                      <Link
                        href="/shop?category=new-arrivals"
                        onClick={onClose}
                        className="block py-2 text-sm uppercase tracking-wider text-gray-600"
                      >
                        New Arrivals
                      </Link>

                      <Link
                        href="/shop?category=western-wear"
                        onClick={onClose}
                        className="block py-2 text-sm uppercase tracking-wider text-gray-600"
                      >
                        Western Wear
                      </Link>

                      <Link
                        href="/shop?category=undergarments"
                        onClick={onClose}
                        className="block py-2 text-sm uppercase tracking-wider text-gray-600"
                      >
                        Undergarments
                      </Link>

                      <Link
                        href="/shop?category=flash-sale"
                        onClick={onClose}
                        className="block py-2 text-sm font-bold uppercase tracking-wider text-red-600"
                      >
                        Flash Sale
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Other links */}
            {[
              {
                name: "About",
                href: "/about",
              },
              {
                name: "Blog",
                href: "/blog",
              },
              {
                name: "Contact",
                href: "/contact",
              },
              {
                name: "FAQ",
                href: "/faq",
              },
            ].map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block border-b border-gray-100 py-4 font-serif text-xl"
                >
                  {link.name}
                </Link>
              </li>
            ))}

            {/* Sale */}
            <li>
              <Link
                href="/shop?category=flash-sale"
                onClick={onClose}
                className="block py-4 font-serif text-xl text-red-600"
              >
                Sale
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="grid grid-cols-3 border-t border-gray-200">
          <Link
            href="/account"
            onClick={onClose}
            className="flex flex-col items-center gap-2 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-600"
          >
            <User className="h-5 w-5" />
            Account
          </Link>

          <Link
            href="/wishlist"
            onClick={onClose}
            className="flex flex-col items-center gap-2 border-x border-gray-200 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-600"
          >
            <div className="relative">
              <Heart className="h-5 w-5" />

              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[8px] text-white">
                  {wishlistCount}
                </span>
              )}
            </div>

            Wishlist
          </Link>

          <button
            onClick={() => {
              onClose();
              dispatch(setCartOpen(true));
            }}
            className="flex flex-col items-center gap-2 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-600"
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[8px] text-white">
                  {cartCount}
                </span>
              )}
            </div>

            Bag
          </button>
        </div>
      </motion.aside>
    </>
  );
}

export default Header;