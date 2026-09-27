"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  ShoppingBag,
  Package,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Loader2,
} from "lucide-react";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;

  address?: {
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  orders?: Order[];
};

type Order = {
  id: string;
  orderNumber?: string;
  total: number;
  status: string;
  createdAt: string;
  items?: {
    productId?: {
      name?: string;
      images?: {
        url: string;
      }[];
    };
    quantity: number;
    price: number;
  }[];
};

const statusConfig: Record<
  string,
  {
    label: string;
    className: string;
    icon: React.ElementType;
  }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-100",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-50 text-blue-700 border-blue-100",
    icon: CheckCircle2,
  },
  processing: {
    label: "Processing",
    className: "bg-purple-50 text-purple-700 border-purple-100",
    icon: Package,
  },
  packed: {
    label: "Packed",
    className: "bg-indigo-50 text-indigo-700 border-indigo-100",
    icon: Package,
  },
  shipped: {
    label: "Shipped",
    className: "bg-cyan-50 text-cyan-700 border-cyan-100",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-50 text-green-700 border-green-100",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border-red-100",
    icon: XCircle,
  },
  exchange: {
    label: "Exchange",
    className: "bg-orange-50 text-orange-700 border-orange-100",
    icon: Package,
  },
};

function formatCurrency(value: number) {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
}

function getStatus(status: string) {
  return (
    statusConfig[status?.toLowerCase()] || {
      label: status || "Unknown",
      className: "bg-gray-50 text-gray-600 border-gray-100",
      icon: Clock,
    }
  );
}

export default function AdminCustomerDetails() {
  const params = useParams();
  const id = params?.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`/api/admin/customers/${id}`);

        if (!res.ok) {
          throw new Error("Failed to fetch customer");
        }

        const data = await res.json();

        setCustomer(data.customer || data);
      } catch (err) {
        console.error(err);
        setError("Unable to load customer information.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        </div>

        <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
          <User className="w-7 h-7 text-red-500" />
        </div>

        <h2 className="text-xl font-serif mb-2">
          Customer Not Found
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          {error || "This customer could not be found."}
        </p>

        <Link
          href="/admin/customer"
          className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </Link>
      </div>
    );
  }

  const orders = customer.orders || [];

  const totalOrders = orders.length;

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const deliveredOrders = orders.filter(
    (order) => order.status?.toLowerCase() === "delivered"
  ).length;

  const initials =
    customer.name
      ?.split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CU";

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/admin/customer"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Customers
          </Link>

          <h1 className="text-3xl font-serif">
            Customer Profile
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            View customer information and order history.
          </p>
        </div>
      </div>

      {/* Profile + Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="xl:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
              {initials}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-serif">
                {customer.name || "Unnamed Customer"}
              </h2>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="w-4 h-4" />
                  {customer.email}
                </div>

                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="w-4 h-4" />
                    {customer.phone}
                  </div>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Customer Since
              </p>

              <p className="text-sm font-semibold mt-1">
                {customer.createdAt
                  ? new Date(customer.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
              <ShoppingBag className="w-5 h-5 text-gray-700" />
            </div>

            <p className="text-2xl font-semibold">
              {totalOrders}
            </p>

            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-1">
              Total Orders
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5 text-gray-700" />
            </div>

            <p className="text-2xl font-semibold">
              {deliveredOrders}
            </p>

            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-1">
              Delivered
            </p>
          </div>

          <div className="col-span-2 bg-black text-white rounded-2xl shadow-sm p-5">
            <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
              Total Spent
            </p>

            <p className="text-2xl font-semibold mt-2">
              {formatCurrency(totalSpent)}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>

            <div>
              <h2 className="font-semibold">
                Customer Information
              </h2>

              <p className="text-xs text-gray-400 mt-0.5">
                Personal details
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Full Name
              </p>

              <p className="text-sm font-medium mt-1">
                {customer.name || "-"}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Email Address
              </p>

              <p className="text-sm font-medium mt-1 break-all">
                {customer.email || "-"}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Phone Number
              </p>

              <p className="text-sm font-medium mt-1">
                {customer.phone || "-"}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                Joined
              </p>

              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />

                <p className="text-sm font-medium">
                  {customer.createdAt
                    ? new Date(
                        customer.createdAt
                      ).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>

            <div>
              <h2 className="font-semibold">
                Default Address
              </h2>

              <p className="text-xs text-gray-400 mt-0.5">
                Customer shipping information
              </p>
            </div>
          </div>

          {customer.address ? (
            <div className="text-sm text-gray-600 leading-7">
              {customer.address.address && (
                <p>{customer.address.address}</p>
              )}

              <p>
                {[
                  customer.address.city,
                  customer.address.state,
                  customer.address.postalCode,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              {customer.address.country && (
                <p>{customer.address.country}</p>
              )}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-sm text-gray-400">
              No address available
            </div>
          )}
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">
              Order History
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              All orders placed by this customer.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <ShoppingBag className="w-4 h-4" />
            {totalOrders} Orders
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6 text-gray-400" />
            </div>

            <h3 className="font-semibold text-sm">
              No Orders Yet
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              This customer has not placed any orders.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Order
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Date
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Items
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Total
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => {
                  const status = getStatus(order.status);
                  const StatusIcon = status.icon;

                  const itemCount =
                    order.items?.reduce(
                      (sum, item) =>
                        sum + Number(item.quantity || 0),
                      0
                    ) || 0;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <span className="font-semibold text-sm">
                          #{order.orderNumber || order.id.slice(-8)}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-gray-500">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Package className="w-4 h-4 text-gray-400" />
                          {itemCount}{" "}
                          {itemCount === 1 ? "item" : "items"}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold">
                        {formatCurrency(order.total)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${status.className}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center px-3 py-2 border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white hover:border-black transition"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}