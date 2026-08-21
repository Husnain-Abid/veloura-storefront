"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle,
  Clock,
  Download,
  User,
  MapPin,
  CreditCard
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { generateInvoicePDF } from "@/lib/invoice";

const STATUSES = [
  "pending", "confirmed", "processing", "packed", "shipped", "delivered", "cancelled", "exchange"
];

export default function AdminOrderDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/admin/orders/details?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true);
    const res = await fetch(`/api/admin/orders/update-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (res.ok) {
      setOrder({ ...order, status: newStatus });
    }
    setUpdating(false);
  };

  const handleDownloadInvoice = () => {
    const doc = generateInvoicePDF(order);
    doc.save(`Invoice-${order.orderNumber}.pdf`);
  };

  if (loading) return <div className="p-24 text-center">Loading order...</div>;
  if (!order) return <div className="p-24 text-center">Order not found</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>
        <div className="flex gap-4">
           <button 
            onClick={handleDownloadInvoice}
            className="bg-white border border-gray-200 text-black px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:border-black transition-colors shadow-sm"
           >
             <Download className="w-4 h-4" /> Invoice
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-50 pb-6">
              <div>
                <h2 className="text-2xl font-serif">Order {order.orderNumber}</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-4">
                 <select 
                  value={order.status}
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  disabled={updating}
                  className="bg-gray-50 border border-gray-100 p-3 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-black rounded-lg appearance-none pr-10 relative"
                 >
                   {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
              </div>
            </div>

            <div className="space-y-6">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex gap-6 items-center">
                  <div className="w-20 aspect-[3/4] bg-gray-50 rounded-lg overflow-hidden shrink-0">
                    <img src={item.product.images[0]?.url} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold uppercase">{item.product.name}</h4>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Size: {item.size} | Color: {item.color}</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatPrice(Number(item.price) * item.quantity)}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{formatPrice(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-gray-50 flex flex-col items-end space-y-3">
              <div className="flex justify-between w-full md:w-64 text-sm">
                <span className="text-gray-400 uppercase tracking-widest font-bold text-[10px]">Subtotal</span>
                <span className="font-bold">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between w-full md:w-64 text-sm">
                <span className="text-gray-400 uppercase tracking-widest font-bold text-[10px]">Shipping</span>
                <span className="font-bold">{formatPrice(order.shippingFee)}</span>
              </div>
              <div className="flex justify-between w-full md:w-64 text-lg pt-4 border-t border-gray-50 font-bold uppercase tracking-widest">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Timeline (Simplified) */}
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Order Status History</h3>
            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
               <div className="relative flex flex-col">
                  <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-black flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest">Order Placed</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
               </div>
               <div className="relative flex flex-col">
                  <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <Clock className="w-3 h-3 text-gray-400" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest italic text-gray-300">Current Status: {order.status}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
             <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <User className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Customer</h3>
             </div>
             <div>
                <p className="text-sm font-bold uppercase">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                <p className="text-xs text-gray-500 mt-1">{order.shippingAddress.email}</p>
                <p className="text-xs text-gray-500">Phone: {order.shippingAddress.phone || "N/A"}</p>
             </div>
          </div>

          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
             <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <MapPin className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Shipping Address</h3>
             </div>
             <div className="text-xs text-gray-600 leading-relaxed">
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, Pakistan</p>
             </div>
          </div>

          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
             <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Payment</h3>
             </div>
             <div>
                <p className="text-xs font-bold uppercase tracking-widest">{order.paymentMethod}</p>
                <p className={cn(
                  "text-[10px] font-bold uppercase tracking-widest mt-1",
                  order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"
                )}>
                  {order.paymentStatus}
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
