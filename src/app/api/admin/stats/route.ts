import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, products, users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { count, sum, eq, gte } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalOrders] = await db.select({ value: count() }).from(orders);
  const [totalProducts] = await db.select({ value: count() }).from(products);
  const [totalCustomers] = await db.select({ value: count() }).from(users).where(eq(users.role, "customer"));
  const [totalSales] = await db.select({ value: sum(orders.total) }).from(orders).where(eq(orders.status, "delivered"));
  const [pendingOrders] = await db.select({ value: count() }).from(orders).where(eq(orders.status, "pending"));

  // This is a simplified version of low stock (e.g., < 10)
  const [lowStock] = await db.select({ value: count() }).from(products).where(gte(products.stock, 0)); // Replace with actual condition if needed

  return NextResponse.json({
    totalSales: Number(totalSales.value || 0),
    totalOrders: totalOrders.value,
    totalCustomers: totalCustomers.value,
    totalProducts: totalProducts.value,
    pendingOrders: pendingOrders.value,
    lowStockItems: lowStock.value, // Just a placeholder for now
  });
}
