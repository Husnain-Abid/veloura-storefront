"use client";

import { MapPin, Phone, Mail, Globe } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          
          {/* Contact Info */}
          <div>
            <h1 className="text-5xl md:text-7xl font-serif mb-8">Contact Us</h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-12">
              Have a question or just want to say hi? We'd love to hear from you. 
              Our customer service team is available Monday to Saturday, 10 AM to 6 PM.
            </p>

            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-full shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Location</h4>
                  <p className="text-sm text-gray-500">123 Fashion Avenue, Gulberg III, Lahore, Pakistan</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-full shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Phone</h4>
                  <p className="text-sm text-gray-500">+92 (042) 1234-5678</p>
                  <p className="text-sm text-gray-500">WhatsApp: +92 300 1234567</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-full shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Email</h4>
                  <p className="text-sm text-gray-500">hello@elegance.pk</p>
                  <p className="text-sm text-gray-500">support@elegance.pk</p>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-12 border-t border-gray-100 flex gap-6">
               <a href="#" className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all"><Globe className="w-4 h-4" /></a>
               <a href="#" className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all"><Globe className="w-4 h-4" /></a>
               <a href="#" className="w-10 h-10 border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all"><Globe className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#f9f9f9] p-8 lg:p-12">
            <h3 className="text-xl font-bold uppercase tracking-tighter mb-8">Send a Message</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Name</label>
                  <input className="w-full p-4 text-sm border-b border-gray-200 focus:outline-none focus:border-black bg-transparent" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email</label>
                  <input className="w-full p-4 text-sm border-b border-gray-200 focus:outline-none focus:border-black bg-transparent" placeholder="Your Email" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Subject</label>
                <input className="w-full p-4 text-sm border-b border-gray-200 focus:outline-none focus:border-black bg-transparent" placeholder="How can we help?" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Message</label>
                <textarea rows={6} className="w-full p-4 text-sm border-b border-gray-200 focus:outline-none focus:border-black bg-transparent resize-none" placeholder="Your Message..." />
              </div>
              <button className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-5 hover:bg-gray-800 transition-colors">
                Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
