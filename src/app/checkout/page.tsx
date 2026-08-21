"use client";

import { useCartStore } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import { ChevronRight, CreditCard, Truck, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, subtotal } = useCartStore();
  const [step, setStep] = useState(1); // 1: Info, 2: Shipping, 3: Payment
  
  const total = subtotal();
  const shipping = total >= 5000 ? 0 : 300;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-serif mb-8">Checkout</h1>
        <p className="text-gray-500 mb-8">Your bag is empty. Please add items before checking out.</p>
        <Link href="/shop" className="bg-black text-white px-8 py-4 text-xs font-bold uppercase">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-24 pb-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Main Checkout Form */}
          <div className="lg:col-span-7">
            <nav className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-12">
              <span className={cn(step >= 1 ? "text-black" : "")}>Information</span>
              <ChevronRight className="w-3 h-3" />
              <span className={cn(step >= 2 ? "text-black" : "")}>Shipping</span>
              <ChevronRight className="w-3 h-3" />
              <span className={cn(step >= 3 ? "text-black" : "")}>Payment</span>
            </nav>

            <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold uppercase tracking-tighter">Contact Information</h2>
                      <span className="text-[10px] text-gray-500">Already have an account? <Link href="/account/login" className="text-black underline">Log in</Link></span>
                    </div>
                    <input 
                      type="email" 
                      placeholder="Email or mobile phone number" 
                      className="w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white"
                      required
                    />
                    <label className="flex items-center gap-3 mt-4 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 border-gray-200 rounded-none checked:bg-black" />
                      <span className="text-[10px] uppercase tracking-widest text-gray-500">Email me with news and offers</span>
                    </label>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-tighter mb-6">Shipping Address</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="First name" className="w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white" />
                      <input placeholder="Last name" className="w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white" />
                      <input placeholder="Address" className="col-span-2 w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white" />
                      <input placeholder="Apartment, suite, etc. (optional)" className="col-span-2 w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white" />
                      <input placeholder="City" className="w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white" />
                      <select className="w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white appearance-none">
                        <option>Pakistan</option>
                      </select>
                      <input placeholder="Postal code (optional)" className="w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white" />
                      <input placeholder="Phone" className="col-span-2 w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <Link href="/cart" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black">
                      <ArrowLeft className="w-3 h-3" /> Return to Bag
                    </Link>
                    <button 
                      onClick={() => setStep(2)}
                      className="bg-black text-white px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                    >
                      Continue to Shipping
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="border border-gray-200 p-6 space-y-4 bg-white">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest">
                      <span className="text-gray-400 w-24">Contact</span>
                      <span className="flex-1 text-black">customer@example.com</span>
                      <button onClick={() => setStep(1)} className="text-black font-bold underline">Change</button>
                    </div>
                    <div className="h-[1px] bg-gray-100" />
                    <div className="flex justify-between text-[10px] uppercase tracking-widest">
                      <span className="text-gray-400 w-24">Ship to</span>
                      <span className="flex-1 text-black">Gulberg III, Lahore, Pakistan</span>
                      <button onClick={() => setStep(1)} className="text-black font-bold underline">Change</button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-tighter mb-6">Shipping Method</h2>
                    <div className="border border-gray-200 bg-white">
                      <label className="flex justify-between items-center p-6 cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <input type="radio" checked className="w-4 h-4" readOnly />
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Standard Shipping</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">2-4 Business Days</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black">
                      <ArrowLeft className="w-3 h-3" /> Return to Information
                    </button>
                    <button 
                      onClick={() => setStep(3)}
                      className="bg-black text-white px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                   <div className="border border-gray-200 p-6 space-y-4 bg-white">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest">
                      <span className="text-gray-400 w-24">Contact</span>
                      <span className="flex-1 text-black">customer@example.com</span>
                      <button onClick={() => setStep(1)} className="text-black font-bold underline">Change</button>
                    </div>
                    <div className="h-[1px] bg-gray-100" />
                    <div className="flex justify-between text-[10px] uppercase tracking-widest">
                      <span className="text-gray-400 w-24">Ship to</span>
                      <span className="flex-1 text-black">Gulberg III, Lahore, Pakistan</span>
                      <button onClick={() => setStep(1)} className="text-black font-bold underline">Change</button>
                    </div>
                    <div className="h-[1px] bg-gray-100" />
                    <div className="flex justify-between text-[10px] uppercase tracking-widest">
                      <span className="text-gray-400 w-24">Method</span>
                      <span className="flex-1 text-black">Standard Shipping · {shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                      <button onClick={() => setStep(2)} className="text-black font-bold underline">Change</button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-tighter mb-2">Payment</h2>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-6">All transactions are secure and encrypted.</p>
                    <div className="border border-gray-200 bg-white overflow-hidden divide-y divide-gray-100">
                      {[
                        { id: 'cod', name: 'Cash on Delivery (COD)' },
                        { id: 'bank', name: 'Direct Bank Transfer' },
                        { id: 'jazzcash', name: 'JazzCash / Easypaisa' },
                        { id: 'card', name: 'Credit / Debit Card' }
                      ].map((method) => (
                        <label key={method.id} className="flex items-center gap-4 p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                          <input type="radio" name="payment" className="w-4 h-4" defaultChecked={method.id === 'cod'} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{method.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                    <button onClick={() => setStep(2)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black">
                      <ArrowLeft className="w-3 h-3" /> Return to Shipping
                    </button>
                    <button 
                      onClick={async () => {
                        const res = await fetch("/api/orders", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            items,
                            shippingAddress: {
                              firstName: "Test",
                              lastName: "Customer",
                              address: "Gulberg III",
                              city: "Lahore",
                              email: "customer@example.com",
                            },
                            paymentMethod: "cod",
                          }),
                        });
                        if (res.ok) {
                          const data = await res.json();
                          alert(`Order placed! Order Number: ${data.order.orderNumber}`);
                          useCartStore.getState().clearCart();
                          window.location.href = "/";
                        } else {
                          const err = await res.json();
                          alert(`Error: ${err.error}`);
                        }
                      }}
                      className="bg-black text-white px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                    >
                      Complete Order
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 bg-[#f9f9f9] lg:min-h-screen p-8 lg:p-12 border-l border-gray-100">
            <div className="sticky top-24 space-y-8">
              <div className="space-y-6 overflow-y-auto max-h-[400px] pr-2">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 items-center">
                    <div className="relative w-16 h-20 bg-white border border-gray-200">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[8px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest">{item.name}</h4>
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest">{item.size} / {item.color}</span>
                    </div>
                    <span className="text-[10px] font-bold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-gray-200 space-y-4">
                <div className="flex items-center gap-4">
                  <input placeholder="Gift card or discount code" className="flex-1 p-4 text-xs border border-gray-200 focus:outline-none focus:border-black bg-white" />
                  <button className="bg-gray-200 text-[10px] font-bold uppercase tracking-widest px-6 py-4 hover:bg-black hover:text-white transition-all">Apply</button>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-200 space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-black">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-black">{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-lg pt-4 text-black font-bold">
                  <span>Total</span>
                  <span className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400 font-normal">PKR</span>
                    {formatPrice(grandTotal)}
                  </span>
                </div>
              </div>

              <div className="pt-8 space-y-4">
                <div className="flex items-center gap-4 text-gray-400">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-[9px] uppercase tracking-widest font-bold">Secure checkout guaranteed</span>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <Truck className="w-5 h-5" />
                  <span className="text-[9px] uppercase tracking-widest font-bold">Estimated delivery: 2-4 business days</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Fixed missing import for cn
import { cn } from "@/lib/utils";
