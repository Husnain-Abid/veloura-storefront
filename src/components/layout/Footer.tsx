import React from "react"
import { Link } from "wouter"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-3xl font-bold">Veloura.</h2>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              Quiet, confident fashion for women who want expressive western silhouettes with an editorial point of view.
            </p>
          </div>
          
          <div>
            <h3 className="uppercase tracking-widest text-sm font-medium mb-6">Shop</h3>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              <li><Link href="/shop?new=true" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop?category=Dresses" className="hover:text-white transition-colors">Dresses</Link></li>
              <li><Link href="/shop?category=Outerwear" className="hover:text-white transition-colors">Outerwear</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="uppercase tracking-widest text-sm font-medium mb-6">Support</h3>
            <ul className="flex flex-col gap-4 text-sm text-gray-400">
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link href="/policies" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="uppercase tracking-widest text-sm font-medium mb-6">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent border-gray-700 text-white placeholder:text-gray-500 focus-visible:ring-gray-500" 
              />
              <Button className="w-full bg-white text-black hover:bg-gray-200">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Veloura. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/policies" className="hover:text-white">Privacy Policy</Link>
            <Link href="/policies" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
