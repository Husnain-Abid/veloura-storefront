"use client";

import { useEffect } from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package, 
  AlertTriangle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { formatPrice, cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdminStats } from "@/store/slices/adminSlice";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const statCards = [
    { name: "Total Sales", value: formatPrice(stats?.totalSales || 0), icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { name: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Total Customers", value: stats?.totalCustomers || 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Total Products", value: stats?.totalProducts || 0, icon: Package, color: "text-orange-600", bg: "bg-orange-50" },
    { name: "Pending Orders", value: stats?.pendingOrders || 0, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { name: "Low Stock", value: stats?.lowStockItems || 0, icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, here&apos;s what&apos;s happening with your store today.</p>
        </div>
        {loading && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4", card.bg, card.color)}>
              <card.icon className="w-6 h-6" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{card.name}</p>
            <h3 className="text-xl font-bold">{loading && !stats ? "..." : card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-serif">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black">View All</Link>
          </div>
          <div className="space-y-6">
            {(stats as any)?.recentOrders?.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-xs">
                    {order.userId?.name?.charAt(0) || "G"}
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase">{order.orderNumber}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{order.userId?.name || "Guest"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatPrice(order.total)}</p>
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-serif">Top Products</h2>
            <Link href="/admin/products" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black">View All</Link>
          </div>
          <div className="space-y-6">
            {(stats as any)?.topProducts?.map((product: any) => (
              <div key={product.id} className="flex items-center gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-12 h-16 bg-gray-100 shrink-0 rounded overflow-hidden">
                   <img src={product.images[0]?.url} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold uppercase line-clamp-1">{product.name}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">{product.reviewCount} Reviews</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatPrice(product.price)}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Stock: {product.stock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
