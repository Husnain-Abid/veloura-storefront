"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";
import { formatPrice, cn } from "@/lib/utils";
import { ChevronRight, CreditCard, Truck, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const CheckoutSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  phone: Yup.string().required("Required"),
  paymentMethod: Yup.string().required("Required"),
});

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const [step, setStep] = useState(1); // 1: Info, 2: Shipping, 3: Payment
  const [isProcessing, setIsProcessing] = useState(false);
  
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = total >= 5000 ? 0 : 300;
  const grandTotal = total + shipping;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-serif mb-8">Checkout</h1>
        <p className="text-gray-500 mb-8">Your bag is empty. Please add items before checking out.</p>
        <Link href="/shop" className="bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-24 pb-24">
      <div className="container mx-auto px-4">
        <Formik
          initialValues={{
            email: "",
            firstName: "",
            lastName: "",
            address: "",
            city: "",
            phone: "",
            paymentMethod: "cod",
          }}
          validationSchema={CheckoutSchema}
          onSubmit={async (values) => {
            setIsProcessing(true);
            try {
              const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  items,
                  shippingAddress: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    address: values.address,
                    city: values.city,
                    email: values.email,
                    phone: values.phone,
                  },
                  paymentMethod: values.paymentMethod,
                }),
              });
              if (res.ok) {
                const data = await res.json();
                alert(`Order placed! Order Number: ${data.order.orderNumber}`);
                dispatch(clearCart());
                window.location.href = "/account";
              } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
              }
            } catch (err) {
              alert("Order processing failed. Please try again.");
            } finally {
              setIsProcessing(false);
            }
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              {/* Main Checkout Form */}
              <div className="lg:col-span-7">
                <nav className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-12">
                  <span className={cn(step >= 1 ? "text-black" : "")}>Information</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className={cn(step >= 2 ? "text-black" : "")}>Shipping</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className={cn(step >= 3 ? "text-black" : "")}>Payment</span>
                </nav>

                <div className="space-y-12">
                  {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-bold uppercase tracking-tighter">Contact Information</h2>
                          <span className="text-[10px] text-gray-500">Already have an account? <Link href="/account/login" className="text-black underline">Log in</Link></span>
                        </div>
                        <Field 
                          name="email"
                          type="email" 
                          placeholder="Email or mobile phone number" 
                          className="w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white rounded-lg"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-[10px] uppercase font-bold mt-1" />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold uppercase tracking-tighter mb-6">Shipping Address</h2>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Field name="firstName" placeholder="First name" className="w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white rounded-lg" />
                            <ErrorMessage name="firstName" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                          </div>
                          <div className="space-y-1">
                            <Field name="lastName" placeholder="Last name" className="w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white rounded-lg" />
                            <ErrorMessage name="lastName" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                          </div>
                          <div className="col-span-2 space-y-1">
                            <Field name="address" placeholder="Address" className="w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white rounded-lg" />
                            <ErrorMessage name="address" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                          </div>
                          <div className="space-y-1">
                            <Field name="city" placeholder="City" className="w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white rounded-lg" />
                            <ErrorMessage name="city" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                          </div>
                          <select className="w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white appearance-none rounded-lg">
                            <option>Pakistan</option>
                          </select>
                          <div className="col-span-2 space-y-1">
                            <Field name="phone" placeholder="Phone" className="w-full p-4 text-sm border border-gray-200 focus:outline-none focus:border-black bg-white rounded-lg" />
                            <ErrorMessage name="phone" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                        <Link href="/cart" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black">
                          <ArrowLeft className="w-3 h-3" /> Return to Bag
                        </Link>
                        <button 
                          type="button"
                          onClick={() => {
                            if (!errors.email && !errors.firstName && !errors.lastName && !errors.address && !errors.city && !errors.phone && values.email && values.firstName) {
                              setStep(2);
                            } else {
                              alert("Please fill in all required fields correctly.");
                            }
                          }}
                          className="bg-black text-white px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors rounded-lg"
                        >
                          Continue to Shipping
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="border border-gray-200 p-6 space-y-4 bg-white rounded-xl shadow-sm">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest">
                          <span className="text-gray-400 w-24">Contact</span>
                          <span className="flex-1 text-black">{values.email}</span>
                          <button type="button" onClick={() => setStep(1)} className="text-black font-bold underline">Change</button>
                        </div>
                        <div className="h-[1px] bg-gray-100" />
                        <div className="flex justify-between text-[10px] uppercase tracking-widest">
                          <span className="text-gray-400 w-24">Ship to</span>
                          <span className="flex-1 text-black">{values.address}, {values.city}</span>
                          <button type="button" onClick={() => setStep(1)} className="text-black font-bold underline">Change</button>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xl font-bold uppercase tracking-tighter mb-6">Shipping Method</h2>
                        <div className="border border-gray-200 bg-white rounded-xl overflow-hidden">
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
                        <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black">
                          <ArrowLeft className="w-3 h-3" /> Return to Information
                        </button>
                        <button 
                          type="button"
                          onClick={() => setStep(3)}
                          className="bg-black text-white px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors rounded-lg"
                        >
                          Continue to Payment
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <div className="border border-gray-200 p-6 space-y-4 bg-white rounded-xl shadow-sm">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest">
                          <span className="text-gray-400 w-24">Contact</span>
                          <span className="flex-1 text-black">{values.email}</span>
                          <button type="button" onClick={() => setStep(1)} className="text-black font-bold underline">Change</button>
                        </div>
                        <div className="h-[1px] bg-gray-100" />
                        <div className="flex justify-between text-[10px] uppercase tracking-widest">
                          <span className="text-gray-400 w-24">Ship to</span>
                          <span className="flex-1 text-black">{values.address}, {values.city}</span>
                          <button type="button" onClick={() => setStep(1)} className="text-black font-bold underline">Change</button>
                        </div>
                        <div className="h-[1px] bg-gray-100" />
                        <div className="flex justify-between text-[10px] uppercase tracking-widest">
                          <span className="text-gray-400 w-24">Method</span>
                          <span className="flex-1 text-black">Standard Shipping · {shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                          <button type="button" onClick={() => setStep(2)} className="text-black font-bold underline">Change</button>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xl font-bold uppercase tracking-tighter mb-2">Payment</h2>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-6">All transactions are secure and encrypted.</p>
                        <div className="border border-gray-200 bg-white rounded-xl overflow-hidden divide-y divide-gray-100">
                          {[
                            { id: 'cod', name: 'Cash on Delivery (COD)' },
                            { id: 'bank', name: 'Direct Bank Transfer' },
                            { id: 'jazzcash', name: 'JazzCash / Easypaisa' },
                            { id: 'card', name: 'Credit / Debit Card' }
                          ].map((method) => (
                            <label key={method.id} className="flex items-center gap-4 p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                              <input 
                                type="radio" 
                                name="paymentMethod" 
                                className="w-4 h-4" 
                                checked={values.paymentMethod === method.id}
                                onChange={() => setFieldValue("paymentMethod", method.id)}
                              />
                              <span className="text-[10px] font-bold uppercase tracking-widest">{method.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-8 border-t border-gray-100">
                        <button type="button" onClick={() => setStep(2)} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black">
                          <ArrowLeft className="w-3 h-3" /> Return to Shipping
                        </button>
                        <button 
                          type="submit"
                          disabled={isProcessing}
                          className="bg-black text-white px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors rounded-lg flex items-center gap-2 disabled:opacity-50"
                        >
                          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Complete Order"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-5 bg-[#f9f9f9] lg:min-h-screen p-8 lg:p-12 border-l border-gray-100">
                <div className="sticky top-24 space-y-8">
                  <div className="space-y-6 overflow-y-auto max-h-[400px] pr-2">
                    {items.map((item) => (
                      <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 items-center">
                        <div className="relative w-16 h-20 bg-white border border-gray-200 rounded-lg overflow-hidden">
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
