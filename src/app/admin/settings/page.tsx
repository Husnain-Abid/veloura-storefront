"use client";

import { useEffect, useState } from "react";
import { Save, Info, Truck, Phone, Mail, Globe } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: "Elegance Fashion",
    contactEmail: "hello@elegance.pk",
    contactPhone: "+92 300 1234567",
    shippingLahore: "200",
    shippingOther: "300",
    freeShippingThreshold: "5000",
    whatsapp: "+92 300 1234567",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch real settings if they exist
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulating save
    setTimeout(() => {
      setSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      <div>
        <h1 className="text-3xl font-serif">Store Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your store details and business rules.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
            <Info className="w-5 h-5 text-gray-400" />
            <h3 className="text-sm font-bold uppercase tracking-widest">General Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Store Name</label>
                <input 
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Support Email</label>
                <input 
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Support Phone</label>
                <input 
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">WhatsApp Business</label>
                <input 
                  value={settings.whatsapp}
                  onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                  className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
                />
             </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
            <Truck className="w-5 h-5 text-gray-400" />
            <h3 className="text-sm font-bold uppercase tracking-widest">Shipping & Delivery</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Shipping - Lahore</label>
                <input 
                  type="number"
                  value={settings.shippingLahore}
                  onChange={(e) => setSettings({ ...settings, shippingLahore: e.target.value })}
                  className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Shipping - Others</label>
                <input 
                  type="number"
                  value={settings.shippingOther}
                  onChange={(e) => setSettings({ ...settings, shippingOther: e.target.value })}
                  className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Free Shipping (Above)</label>
                <input 
                  type="number"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
                  className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
                />
             </div>
          </div>
        </div>

        <div className="flex justify-end">
           <button 
            type="submit"
            disabled={saving}
            className="bg-black text-white px-10 py-5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl disabled:opacity-50"
           >
             <Save className="w-5 h-5" />
             {saving ? "Saving..." : "Save Settings"}
           </button>
        </div>
      </form>
    </div>
  );
}
