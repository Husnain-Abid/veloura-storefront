"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Tag } from "lucide-react";

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch("/api/admin/coupons");
        const data = await res.json();
        setCoupons(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif">Coupons</h1>
          <p className="text-gray-500 text-sm mt-1">Manage discount codes and promotions.</p>
        </div>
        <button className="bg-black text-white px-6 py-4 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading coupons...</p>
        ) : coupons.length === 0 ? (
          <div className="col-span-full py-24 text-center bg-white border border-gray-100 rounded-xl">
            <Tag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">No coupons found</p>
          </div>
        ) : coupons.map((coupon) => (
          <div key={coupon.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
             <div className="flex justify-between items-start">
                <span className="bg-black text-white px-3 py-1 rounded text-lg font-mono font-bold">{coupon.code}</span>
                <span className={coupon.isActive ? "text-green-600 font-bold text-[10px] uppercase" : "text-red-600 font-bold text-[10px] uppercase"}>
                  {coupon.isActive ? "Active" : "Inactive"}
                </span>
             </div>
             <div>
                <p className="text-sm font-bold uppercase">{coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : ' PKR'} OFF</p>
                <p className="text-xs text-gray-400 mt-1">Min. Order: {coupon.minOrderAmount} PKR</p>
             </div>
             <div className="flex justify-end gap-2 pt-4 border-t border-gray-50">
                <button className="p-2 hover:bg-gray-100 rounded transition-colors"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                <button className="p-2 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4 text-red-600" /></button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
