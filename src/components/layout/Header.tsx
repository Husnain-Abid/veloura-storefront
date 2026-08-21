"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, 
  User, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore, useWishlistStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchModal } from "@/components/layout/SearchModal";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { 
    name: "Shop", 
    href: "/shop",
    children: [
      { name: "New Arrivals", href: "/shop?category=new-arrivals" },
      { name: "Western Wear", href: "/shop?category=western-wear" },
      { name: "Undergarments", href: "/shop?category=undergarments" },
      { name: "Flash Sale", href: "/shop?category=flash-sale" },
    ]
  },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled || pathname !== "/" ? "bg-white shadow-sm py-3" : "bg-transparent py-5 text-white"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <Link href="/" className="text-xl md:text-2xl font-bold tracking-tighter uppercase">
          ELEGANCE
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <div key={link.name} className="relative group">
              <Link 
                href={link.href}
                className={cn(
                  "text-sm font-medium tracking-widest uppercase hover:opacity-70 transition-opacity flex items-center gap-1",
                  pathname === link.href ? "border-b border-current" : ""
                )}
              >
                {link.name}
                {link.children && <ChevronDown className="w-3 h-3" />}
              </Link>
              
              {link.children && (
                <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="bg-white text-black shadow-xl border border-gray-100 min-w-[200px] p-4 flex flex-col gap-3">
                    {link.children.map((child) => (
                      <Link 
                        key={child.name} 
                        href={child.href}
                        className="text-xs font-medium uppercase hover:pl-2 transition-all"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="hover:opacity-70 transition-opacity"
          >
            <Search className="w-5 h-5" />
          </button>
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/account" className="hidden md:flex items-center gap-2 hover:opacity-70 transition-opacity">
                <User className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-widest hidden xl:inline">{user.name || user.email.split('@')[0]}</span>
              </Link>
              <button onClick={logout} className="hover:opacity-70 transition-opacity">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link href="/account/login" className="hidden md:block hover:opacity-70 transition-opacity">
              <User className="w-5 h-5" />
            </Link>
          )}
          <Link href="/wishlist" className="relative hover:opacity-70 transition-opacity">
            <Heart className="w-5 h-5" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
                {wishlistItems.length}
              </span>
            )}
          </Link>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative hover:opacity-70 transition-opacity"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-xs bg-white text-black z-[60] lg:hidden p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold uppercase tracking-tighter">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <nav className="flex flex-col gap-6">
                {NAV_LINKS.map((link) => (
                  <div key={link.name} className="flex flex-col gap-4">
                    <Link 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium uppercase tracking-widest"
                    >
                      {link.name}
                    </Link>
                    {link.children && (
                      <div className="flex flex-col gap-3 pl-4 border-l border-gray-100">
                        {link.children.map((child) => (
                          <Link 
                            key={child.name} 
                            href={child.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-sm text-gray-600 uppercase"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-4">
                <Link 
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-sm font-medium uppercase"
                >
                  <User className="w-5 h-5" /> Account
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
