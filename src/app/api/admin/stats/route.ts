import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Order, Product, User } from "@/models";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: "customer" });
    
    const deliveredOrders = await Order.find({ status: "delivered" });
    const totalSales = deliveredOrders.reduce((acc, order) => acc + order.total, 0);
    
    const pendingOrdersCount = await Order.countDocuments({ status: "pending" });
    const lowStockCount = await Product.countDocuments({ stock: { $lt: 10 } });

    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId");

    const topProducts = await Product.find({})
      .sort({ reviewCount: -1 }) // Simple metric for "top" if we don't have sales count per product
      .limit(5);

    return NextResponse.json({
      totalSales,
      totalOrders,
      totalCustomers,
      totalProducts,
      pendingOrders: pendingOrdersCount,
      lowStockItems: lowStockCount,
      recentOrders: recentOrders.map(o => {
        const obj = o.toObject();
        obj.id = obj._id.toString();
        return obj;
      }),
      topProducts: topProducts.map(p => {
        const obj = p.toObject();
        obj.id = obj._id.toString();
        return obj;
      }),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
