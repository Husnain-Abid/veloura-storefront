"use client";

import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    pendingOrders: 0,
    lowStockItems: 0,
  });

  useEffect(() => {
    // In a real app, fetch these from an API
    const fetchStats = async () => {
      // Simulating API call
      setStats({
        totalSales: 1254300,
        totalOrders: 450,
        totalCustomers: 1200,
        totalProducts: 85,
        pendingOrders: 12,
        lowStockItems: 5,
      });
    };
    fetchStats();
  }, []);

  const statCards = [
    { name: "Total Sales", value: formatPrice(stats.totalSales), icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
    { name: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Total Customers", value: stats.totalCustomers, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Total Products", value: stats.totalProducts, icon: Package, color: "text-orange-600", bg: "bg-orange-50" },
    { name: "Pending Orders", value: stats.pendingOrders, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { name: "Low Stock", value: stats.lowStockItems, icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4", card.bg, card.color)}>
              <card.icon className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{card.name}</p>
            <h3 className="text-xl font-bold">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-serif">Recent Orders</h2>
            <button className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black">View All</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-xs">
                    TC
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase">ORD-12345{i}</p>
                    <p className="text-xs text-gray-400">Test Customer</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatPrice(5400)}</p>
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Delivered</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-serif">Top Products</h2>
            <button className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black">View All</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-12 h-16 bg-gray-100 shrink-0">
                   <img src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=100&auto=format&fit=crop`} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold uppercase line-clamp-1">Premium Western Outfit {i}</p>
                  <p className="text-xs text-gray-400">45 Sales</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatPrice(3500)}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Revenue: {formatPrice(157500)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
