"use client";

import { useEffect, useState } from "react";
import { 
  Search, 
  Eye,
  Filter,
  Package,
  Loader2
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdminOrders } from "@/store/slices/orderSlice";

const STATUS_COLORS = {
  pending: "bg-yellow-50 text-yellow-600",
  confirmed: "bg-blue-50 text-blue-600",
  processing: "bg-indigo-50 text-indigo-600",
  packed: "bg-purple-50 text-purple-600",
  shipped: "bg-orange-50 text-orange-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
  exchange: "bg-gray-50 text-gray-600",
};

export default function AdminOrders() {
  const dispatch = useAppDispatch();
  const { adminOrders: orders, loading } = useAppSelector((state) => state.order);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Manage customer orders and status updates.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-black rounded-lg"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Order #</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Total</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && orders.length === 0 ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8">
                       <div className="h-4 bg-gray-100 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-sm uppercase">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold uppercase">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</span>
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest">{order.shippingAddress.city}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      STATUS_COLORS[order.status as keyof typeof STATUS_COLORS] || "bg-gray-50 text-gray-600"
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="p-2 hover:bg-gray-100 rounded-lg inline-block transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
