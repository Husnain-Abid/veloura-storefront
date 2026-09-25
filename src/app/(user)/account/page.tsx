"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, PackageOpen } from "lucide-react";

import { useAppSelector } from "@/store/hooks";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  status: string;
  items?: any[];
}

export default function AccountPage() {
  const router = useRouter();

  // Get user from Redux
  const { user, loading } = useAppSelector(
    (state) => state.auth
  );

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  /* ---------------------------------------------------------------------- */
  /* Redirect if user is not logged in                                     */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/account/login");
    }
  }, [user, loading, router]);

  /* ---------------------------------------------------------------------- */
  /* Fetch User Orders                                                      */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);

        const res = await fetch("/api/orders/user", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          console.error(
            "Failed to fetch orders:",
            res.status
          );
          return;
        }

        const data = await res.json();

        // Support both:
        // API returning [...]
        // API returning { orders: [...] }
        if (Array.isArray(data)) {
          setOrders(data);
        } else if (Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("FETCH ORDERS ERROR:", error);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  /* ---------------------------------------------------------------------- */
  /* Loading                                                                */
  /* ---------------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-6 w-6 animate-spin" />

          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Loading account...
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* User not authenticated                                                 */
  /* ---------------------------------------------------------------------- */

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Redirecting to login...
        </p>
      </div>
    );
  }

  /* ---------------------------------------------------------------------- */
  /* Page                                                                    */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mx-auto max-w-6xl">

        {/* Page Header */}
        <div className="mb-12">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
            Welcome back
          </p>

          <h1 className="text-4xl font-serif md:text-5xl">
            My Account
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">

          {/* ================================================================= */}
          {/* Profile                                                           */}
          {/* ================================================================= */}

          <div className="lg:col-span-1">
            <div className="space-y-8">

              <div>
                <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Profile Details
                </h4>

                <div className="space-y-2">
                  <p className="text-sm font-bold uppercase">
                    {user.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Saved Addresses */}
              <div className="border-t border-gray-100 pt-8">
                <h4 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Saved Addresses
                </h4>

                <p className="text-xs italic text-gray-500">
                  No addresses saved yet.
                </p>
              </div>

              {/* Account Links */}
              <div className="border-t border-gray-100 pt-8">
                <div className="space-y-4">

                  <Link
                    href="/account/orders"
                    className="block text-xs font-bold uppercase tracking-widest hover:text-gray-500"
                  >
                    My Orders →
                  </Link>

                  <Link
                    href="/wishlist"
                    className="block text-xs font-bold uppercase tracking-widest hover:text-gray-500"
                  >
                    Wishlist →
                  </Link>

                  <Link
                    href="/shop"
                    className="block text-xs font-bold uppercase tracking-widest hover:text-gray-500"
                  >
                    Continue Shopping →
                  </Link>

                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* Order History                                                     */}
          {/* ================================================================= */}

          <div className="lg:col-span-3">

            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-serif">
                Order History
              </h2>

              {orders.length > 0 && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {orders.length}{" "}
                  {orders.length === 1 ? "Order" : "Orders"}
                </span>
              )}
            </div>

            {/* Orders Loading */}
            {ordersLoading ? (
              <div className="flex min-h-[250px] items-center justify-center border border-gray-100">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-6 w-6 animate-spin" />

                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Loading orders...
                  </p>
                </div>
              </div>
            ) : orders.length > 0 ? (

              /* ============================================================= */
              /* Orders                                                         */
              /* ============================================================= */

              <div className="space-y-4">

                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-100 bg-white p-6 transition-colors hover:border-gray-200"
                  >
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                      {/* Order Info */}
                      <div className="flex flex-col gap-2">

                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Order #{order.orderNumber}
                        </span>

                        <span className="text-sm font-bold uppercase">
                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </span>

                        <span className="text-xs text-gray-500">
                          {order.items?.length || 0}{" "}
                          {order.items?.length === 1
                            ? "Item"
                            : "Items"}
                        </span>
                      </div>

                      {/* Price + Status */}
                      <div className="flex flex-row items-center gap-6 md:flex-col md:items-end">

                        <span className="text-sm font-bold">
                          {formatPrice(order.total)}
                        </span>

                        <span className="bg-black px-3 py-1.5 text-[8px] font-bold uppercase tracking-widest text-white">
                          {order.status}
                        </span>

                      </div>

                      {/* View Details */}
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="inline-block text-[10px] font-bold uppercase tracking-widest"
                      >
                        <span className="border-b border-black pb-1 transition-colors hover:border-gray-400 hover:text-gray-500">
                          View Details →
                        </span>
                      </Link>

                    </div>
                  </div>
                ))}

              </div>

            ) : (

              /* ============================================================= */
              /* Empty Orders                                                   */
              /* ============================================================= */

              <div className="flex min-h-[350px] flex-col items-center justify-center bg-gray-50 px-6 text-center">

                <PackageOpen className="mb-6 h-10 w-10 text-gray-300" />

                <p className="mb-3 text-sm font-bold uppercase tracking-widest">
                  No Orders Yet
                </p>

                <p className="mb-8 max-w-sm text-xs leading-6 text-gray-500">
                  You haven't placed any orders yet.
                  Discover our latest collection and
                  find something you love.
                </p>

                <Link
                  href="/shop"
                  className="bg-black px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
                >
                  Start Shopping
                </Link>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

