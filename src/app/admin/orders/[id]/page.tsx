
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Download,
  User,
  MapPin,
  CreditCard,
  ImageOff,
  Loader2,
  Package,
  Truck,
  Phone,
  Mail,
  CalendarDays,
  Hash,
  Palette,
  Ruler,
  CircleDollarSign,
  ChevronRight,
} from "lucide-react";

import { formatPrice, cn } from "@/lib/utils";
import { generateInvoicePDF } from "@/lib/invoice";
import { useAppDispatch } from "@/store/hooks";
import { updateOrderStatusThunk } from "@/store/slices/orderSlice";

/* =========================================================
   STATUS
========================================================= */

const STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "exchange",
] as const;

type OrderStatus = (typeof STATUSES)[number];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-100",
  confirmed: "bg-blue-50 text-blue-700 border-blue-100",
  processing: "bg-indigo-50 text-indigo-700 border-indigo-100",
  packed: "bg-purple-50 text-purple-700 border-purple-100",
  shipped: "bg-orange-50 text-orange-700 border-orange-100",
  delivered: "bg-green-50 text-green-700 border-green-100",
  cancelled: "bg-red-50 text-red-700 border-red-100",
  exchange: "bg-gray-50 text-gray-700 border-gray-200",
};

/* =========================================================
   HELPERS
========================================================= */

const getProductImageForOrderItem = (
  product: any,
  color?: string
): string | null => {
  if (!product) return null;

  /*
   * New variant structure:
   *
   * variants: [
   *   {
   *     color: { name, hex },
   *     images: [{ url, publicId }],
   *     sizes: [...]
   *   }
   * ]
   */

  if (color && Array.isArray(product.variants)) {
    const variant = product.variants.find(
      (item: any) =>
        item?.color?.name?.toLowerCase() === color.toLowerCase()
    );

    const variantImage = variant?.images?.[0];

    if (variantImage) {
      return typeof variantImage === "string"
        ? variantImage
        : variantImage.url || null;
    }
  }

  /*
   * Legacy fallback
   */

  const productImage = product.images?.[0];

  if (productImage) {
    return typeof productImage === "string"
      ? productImage
      : productImage.url || null;
  }

  return null;
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered":
      return CheckCircle2;

    case "shipped":
      return Truck;

    case "processing":
    case "packed":
      return Package;

    default:
      return Clock3;
  }
};

/* =========================================================
   PAGE
========================================================= */

export default function AdminOrderDetails() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     FETCH ORDER
  ========================================================== */

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `/api/admin/orders/details?id=${encodeURIComponent(
            id as string
          )}`
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load order");
          return;
        }

        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Failed to load order. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  /* =========================================================
     STATUS UPDATE
  ========================================================== */

  const handleStatusUpdate = async (newStatus: string) => {
    if (!id || !order) return;

    const previousStatus = order.status;

    setUpdating(true);

    try {
      await dispatch(
        updateOrderStatusThunk({
          id: id as string,
          status: newStatus,
        })
      ).unwrap();

      setOrder((prev: any) => ({
        ...prev,
        status: newStatus,
      }));
    } catch (err) {
      console.error("Failed to update status:", err);

      setOrder((prev: any) => ({
        ...prev,
        status: previousStatus,
      }));

      alert("Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  /* =========================================================
     INVOICE
  ========================================================== */

  // const handleDownloadInvoice = () => {
  //   if (!order) return;

  //   const doc = generateInvoicePDF(order);

  //   doc.save(`Invoice-${order.orderNumber}.pdf`);
  // };
const handleDownloadInvoice = () => {
  if (!order) return;

  generateInvoicePDF(order);
};

  /* =========================================================
     ORDER TOTAL ITEMS
  ========================================================== */

  const totalItems = useMemo(() => {
    if (!order?.items) return 0;

    return order.items.reduce(
      (total: number, item: any) =>
        total + Number(item.quantity || 0),
      0
    );
  }, [order]);

  /* =========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-black animate-spin" />

          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Loading order...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================== */

  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-5">
          <Package className="w-7 h-7 text-red-500" />
        </div>

        <h2 className="text-2xl font-serif mb-2">
          Unable to load order
        </h2>

        <p className="text-sm text-gray-500 mb-7 max-w-md">
          {error}
        </p>

        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>
      </div>
    );
  }

  /* =========================================================
     NOT FOUND
  ========================================================== */

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-5">
          <Package className="w-7 h-7 text-gray-400" />
        </div>

        <h2 className="text-2xl font-serif mb-2">
          Order not found
        </h2>

        <p className="text-sm text-gray-500 mb-7">
          The order you are looking for does not exist.
        </p>

        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </button>
      </div>
    );
  }

  const StatusIcon = getStatusIcon(order.status);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24">
      {/* =====================================================
          TOP HEADER
      ====================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-serif">
              Order {order.orderNumber}
            </h1>

            <span
              className={cn(
                "px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest",
                STATUS_STYLES[order.status] ||
                  "bg-gray-50 text-gray-600 border-gray-100"
              )}
            >
              {order.status}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-2">
            Manage order details, products, payment and delivery.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadInvoice}
          className="bg-black text-white px-6 py-3.5 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Download Invoice
        </button>
      </div>

      {/* =====================================================
          QUICK STATS
      ====================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Order Total
            </span>

            <CircleDollarSign className="w-4 h-4 text-gray-400" />
          </div>

          <p className="text-xl font-bold">
            {formatPrice(order.total)}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Items
            </span>

            <Package className="w-4 h-4 text-gray-400" />
          </div>

          <p className="text-xl font-bold">
            {totalItems}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Payment
            </span>

            <CreditCard className="w-4 h-4 text-gray-400" />
          </div>

          <p className="text-sm font-bold uppercase">
            {order.paymentMethod || "N/A"}
          </p>

          <p
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest mt-1",
              order.paymentStatus === "paid"
                ? "text-green-600"
                : "text-yellow-600"
            )}
          >
            {order.paymentStatus || "pending"}
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Order Date
            </span>

            <CalendarDays className="w-4 h-4 text-gray-400" />
          </div>

          <p className="text-sm font-bold">
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ===================================================
            LEFT / MAIN
        ==================================================== */}

        <div className="xl:col-span-2 space-y-6">
          {/* =================================================
              ORDER + PRODUCTS
          ================================================== */}

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 md:p-7 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-gray-400" />

                    <h2 className="text-lg font-bold">
                      {order.orderNumber}
                    </h2>
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-3">
                  <select
                    value={order.status}
                    onChange={(event) =>
                      handleStatusUpdate(event.target.value)
                    }
                    disabled={updating}
                    className="min-w-[160px] bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-black disabled:opacity-50"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  {updating && (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="divide-y divide-gray-100">
              {order.items?.length > 0 ? (
                order.items.map((item: any, index: number) => {
                  const product = item.productId;

                  const productName =
                    product?.name || "Product unavailable";

                  const productImage =
                    getProductImageForOrderItem(
                      product,
                      item.color
                    );

                  const lineTotal =
                    Number(item.price || 0) *
                    Number(item.quantity || 0);

                  return (
                    <div
                      key={
                        item.id ||
                        item._id ||
                        `${item.productId}-${index}`
                      }
                      className="p-6 md:p-7"
                    >
                      <div className="flex flex-col sm:flex-row gap-5">
                        {/* Image */}
                        <div className="w-24 h-28 sm:w-28 sm:h-36 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={productName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                              <ImageOff className="w-7 h-7" />

                              <span className="text-[8px] uppercase tracking-widest mt-2">
                                No Image
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                            <div>
                              <h3 className="text-base font-bold uppercase">
                                {productName}
                              </h3>

                              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                                Product Item
                              </p>
                            </div>

                            <div className="lg:text-right">
                              <p className="text-lg font-bold">
                                {formatPrice(lineTotal)}
                              </p>

                              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                                {formatPrice(
                                  Number(item.price || 0)
                                )}{" "}
                                × {item.quantity}
                              </p>
                            </div>
                          </div>

                          {/* Variant info */}
                          <div className="flex flex-wrap gap-3 mt-5">
                            {item.color && (
                              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                                <Palette className="w-3.5 h-3.5 text-gray-400" />

                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                  Color: {item.color}
                                </span>
                              </div>
                            )}

                            {item.size && (
                              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                                <Ruler className="w-3.5 h-3.5 text-gray-400" />

                                <span className="text-[10px] font-bold uppercase tracking-widest">
                                  Size: {item.size}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                              <Package className="w-3.5 h-3.5 text-gray-400" />

                              <span className="text-[10px] font-bold uppercase tracking-widest">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>

                          {!product && (
                            <p className="text-[10px] text-red-500 uppercase tracking-widest mt-4">
                              Product no longer exists in catalog.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-10 text-center text-sm text-gray-400">
                  No products found in this order.
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="p-6 md:p-7 bg-gray-50 border-t border-gray-100">
              <div className="ml-auto max-w-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Subtotal
                  </span>

                  <span className="text-sm font-bold">
                    {formatPrice(order.subtotal || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Shipping
                  </span>

                  <span className="text-sm font-bold">
                    {Number(order.shippingFee || 0) === 0
                      ? "FREE"
                      : formatPrice(order.shippingFee)}
                  </span>
                </div>

                {Number(order.discountAmount || 0) > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Discount
                    </span>

                    <span className="text-sm font-bold text-green-600">
                      -{formatPrice(order.discountAmount)}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Total
                  </span>

                  <span className="text-xl font-bold">
                    {formatPrice(order.total || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              STATUS TIMELINE
          ================================================== */}

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 md:p-7">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <StatusIcon className="w-4 h-4 text-gray-600" />
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest">
                  Order Status
                </h3>

                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                  Current order progress
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-100" />

              <div className="space-y-7">
                <div className="relative flex gap-5">
                  <div className="relative z-10 w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>

                  <div className="pt-1">
                    <p className="text-xs font-bold uppercase tracking-widest">
                      Order Placed
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="relative flex gap-5">
                  <div
                    className={cn(
                      "relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      order.status === "delivered"
                        ? "bg-green-600"
                        : "bg-black"
                    )}
                  >
                    <StatusIcon className="w-4 h-4 text-white" />
                  </div>

                  <div className="pt-1">
                    <p className="text-xs font-bold uppercase tracking-widest">
                      {order.status}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Current order status
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT SIDEBAR
        ==================================================== */}

        <div className="space-y-6">
          {/* Customer */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  Customer
                </h3>

                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                  Customer information
                </p>
              </div>
            </div>

            <div className="pt-5 space-y-4">
              <div>
                <p className="text-sm font-bold uppercase">
                  {order.shippingAddress?.firstName || ""}{" "}
                  {order.shippingAddress?.lastName || ""}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />

                <p className="text-xs text-gray-500 break-all">
                  {order.shippingAddress?.email || "N/A"}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />

                <p className="text-xs text-gray-500">
                  {order.shippingAddress?.phone || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-gray-600" />
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  Shipping Address
                </h3>

                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                  Delivery destination
                </p>
              </div>
            </div>

            <div className="pt-5 text-xs text-gray-600 leading-7">
              <p>
                {order.shippingAddress?.address || "N/A"}
              </p>

              {order.shippingAddress?.address2 && (
                <p>
                  {order.shippingAddress.address2}
                </p>
              )}

              <p>
                {order.shippingAddress?.city || "N/A"}
                {order.shippingAddress?.state
                  ? `, ${order.shippingAddress.state}`
                  : ""}
              </p>

              {order.shippingAddress?.postalCode && (
                <p>
                  {order.shippingAddress.postalCode}
                </p>
              )}

              <p>
                {order.shippingAddress?.country || "Pakistan"}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-gray-600" />
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  Payment
                </h3>

                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                  Payment information
                </p>
              </div>
            </div>

            <div className="pt-5">
              <p className="text-sm font-bold uppercase">
                {order.paymentMethod || "N/A"}
              </p>

              <span
                className={cn(
                  "inline-flex mt-3 px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                  order.paymentStatus === "paid"
                    ? "bg-green-50 text-green-700 border-green-100"
                    : "bg-yellow-50 text-yellow-700 border-yellow-100"
                )}
              >
                {order.paymentStatus || "pending"}
              </span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-black text-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest">
                  Order Summary
                </h3>

                <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                  Final amount
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-white/50">
                  Items
                </span>

                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-white/50">
                  Subtotal
                </span>

                <span>
                  {formatPrice(order.subtotal || 0)}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-white/50">
                  Shipping
                </span>

                <span>
                  {Number(order.shippingFee || 0) === 0
                    ? "FREE"
                    : formatPrice(order.shippingFee)}
                </span>
              </div>

              {Number(order.discountAmount || 0) > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">
                    Discount
                  </span>

                  <span className="text-green-400">
                    -{formatPrice(order.discountAmount)}
                  </span>
                </div>
              )}

              <div className="border-t border-white/10 pt-4 mt-4 flex justify-between">
                <span className="text-xs font-bold uppercase tracking-widest">
                  Total
                </span>

                <span className="text-xl font-bold">
                  {formatPrice(order.total || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Back */}
          <button
            type="button"
            onClick={() => router.push("/admin/orders")}
            className="w-full flex items-center justify-center gap-2 py-4 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Orders
          </button>
        </div>
      </div>
    </div>
  );
}

