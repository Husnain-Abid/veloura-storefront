"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/account/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        const res = await fetch("/api/orders/user");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      }
    };
    fetchOrders();
  }, [user]);

  if (loading || !user) return <div className="container mx-auto p-24 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-serif mb-12">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Profile Details</h4>
              <p className="text-sm font-bold uppercase">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <div className="pt-8 border-t border-gray-100">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Saved Addresses</h4>
              <p className="text-xs text-gray-500 italic">No addresses saved yet.</p>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-serif mb-8">Order History</h2>
            
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Order #{order.orderNumber}</span>
                      <span className="text-sm font-bold uppercase">{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="text-xs text-gray-500">{order.items?.length || 0} Items</span>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-1">
                      <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                      <span className="bg-black text-white text-[8px] font-bold uppercase tracking-widest px-2 py-1">
                        {order.status}
                      </span>
                    </div>
                    <Link 
                      href={`/account/orders/${order.id}`}
                      className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1"
                    >
                      View Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-24 text-center bg-gray-50">
                <p className="text-gray-500 text-sm uppercase tracking-widest mb-6">You haven't placed any orders yet.</p>
                <Link href="/shop" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1">Start Shopping</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
