import React, { useEffect, useState } from "react"
import { Link, useLocation } from "wouter"
import { Search, ShoppingBag, Heart, User, Menu, X } from "lucide-react"
import { useCart } from "@/store/cart"
import { useWishlist } from "@/store/wishlist"
import { CATEGORIES } from "@/lib/dummy-data"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [location] = useLocation()
  
  const { items: cartItems, setIsOpen: setCartOpen } = useCart()
  const { items: wishlistItems } = useWishlist()
  
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const wishlistCount = wishlistItems.length

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
  }, [location])

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-foreground text-background text-xs py-2 text-center tracking-widest font-medium">
        FREE SHIPPING ON ORDERS OVER RS. 5,000 | NEW ARRIVALS DROP EVERY WEEK
      </div>

      <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-background"}`}>
        <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <div className="flex-1 lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2">
              <Menu size={24} />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex flex-1 gap-8 text-sm uppercase tracking-widest font-medium">
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <Link href="/shop?category=Dresses" className="hover:text-primary transition-colors">Dresses</Link>
            <Link href="/shop?new=true" className="hover:text-primary transition-colors">New Arrivals</Link>
            <Link href="/journal" className="hover:text-primary transition-colors">Journal</Link>
          </nav>

          {/* Logo */}
          <Link href="/" className="font-serif text-3xl font-bold tracking-tight text-center flex-1 lg:flex-none">
            Veloura.
          </Link>

          {/* Actions */}
          <div className="flex-1 flex justify-end items-center gap-4 lg:gap-6">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-1 hover:text-primary transition-colors hidden sm:block">
              <Search size={20} />
            </button>
            <Link href="/account" className="p-1 hover:text-primary transition-colors hidden sm:block">
              <User size={20} />
            </Link>
            <Link href="/wishlist" className="p-1 hover:text-primary transition-colors relative">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full font-medium">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button onClick={() => setCartOpen(true)} className="p-1 hover:text-primary transition-colors relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-foreground text-background text-[10px] flex items-center justify-center rounded-full font-medium">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 w-full bg-background border-b shadow-lg animate-in slide-in-from-top-2 p-6">
            <div className="container max-w-2xl mx-auto flex gap-4">
              <input 
                type="text" 
                placeholder="Search for products, categories..." 
                className="flex-1 border-b border-foreground bg-transparent text-lg py-2 outline-none font-serif"
                autoFocus
              />
              <button onClick={() => setIsSearchOpen(false)}>
                <X size={24} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-background h-full shadow-xl flex flex-col animate-in slide-in-from-left">
            <div className="p-4 flex justify-between items-center border-b border-border">
              <span className="font-serif text-xl font-bold">Veloura.</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col py-6 px-4 gap-6 text-lg uppercase tracking-widest font-medium overflow-y-auto">
              <Link href="/">Home</Link>
              <Link href="/shop">Shop All</Link>
              <Link href="/shop?new=true" className="text-primary">New Arrivals</Link>
              <div className="h-px bg-border my-2" />
              {CATEGORIES.filter(c => c !== "All").map(category => (
                <Link key={category} href={`/shop?category=${category}`} className="text-sm text-muted-foreground">{category}</Link>
              ))}
              <div className="h-px bg-border my-2" />
              <Link href="/account" className="text-sm flex items-center gap-3"><User size={18} /> My Account</Link>
              <Link href="/wishlist" className="text-sm flex items-center gap-3"><Heart size={18} /> Wishlist</Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
