import Link from "next/link";
import { Globe, MapPin, Phone, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#f9f9f9] pt-20 pb-10 border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold tracking-tighter uppercase mb-6 block">
              ELEGANCE
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Premium women&apos;s fashion destination in Pakistan. We bring you the latest in Western Wear and Luxury Intimates.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="#" className="hover:text-gray-400 transition-colors"><Globe className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-gray-400 transition-colors"><Globe className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-gray-400 transition-colors"><Globe className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-gray-400 transition-colors"><Globe className="w-5 h-5" /></Link>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><Link href="/shop?category=new-arrivals" className="hover:text-black transition-colors">New Arrivals</Link></li>
              <li><Link href="/shop?category=western-wear" className="hover:text-black transition-colors">Western Wear</Link></li>
              <li><Link href="/shop?category=undergarments" className="hover:text-black transition-colors">Undergarments</Link></li>
              <li><Link href="/shop?category=flash-sale" className="hover:text-black transition-colors">Flash Sale</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Policies</h4>
            <ul className="space-y-4 text-sm text-gray-600">
              <li><Link href="/policies/shipping" className="hover:text-black transition-colors">Shipping Policy</Link></li>
              <li><Link href="/policies/exchange" className="hover:text-black transition-colors">Exchange Policy</Link></li>
              <li><Link href="/policies/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
              <li><Link href="/policies/terms" className="hover:text-black transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/faq" className="hover:text-black transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-6">Newsletter</h4>
            <p className="text-sm text-gray-600 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
              <button className="bg-black text-white text-xs font-bold uppercase tracking-widest py-3 hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            © {new Date().getFullYear()} ELEGANCE Fashion Pakistan. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-50 grayscale hover:grayscale-0 transition-all" />
          </div>
        </div>
      </div>
    </footer>
  );
};
