import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, shippingAddress, paymentMethod, couponId } = await req.json();

    let subtotal = 0;
    const itemsToCreate: {
      productId: string;
      quantity: number;
      price: string;
      size?: string;
      color?: string;
    }[] = [];

    for (const item of items) {
      const product = await db.query.products.findFirst({
        where: eq(products.id, item.id),
      });

      if (!product) {
        return NextResponse.json({ error: `Product ${item.name} not found` }, { status: 404 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
      }

      const price = Number(product.salePrice || product.price);
      subtotal += price * item.quantity;

      itemsToCreate.push({
        productId: product.id,
        quantity: item.quantity,
        price: price.toString(),
        size: item.size,
        color: item.color,
      });
    }

    const shippingFee = subtotal >= 5000 ? 0 : 300;
    const total = subtotal + shippingFee;
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const result = await db.transaction(async (tx) => {
      const [newOrder] = await tx.insert(orders).values({
        orderNumber,
        userId: session.id,
        subtotal: subtotal.toString(),
        shippingFee: shippingFee.toString(),
        total: total.toString(),
        paymentMethod,
        shippingAddress,
        couponId: couponId || null,
      }).returning();

      for (const item of itemsToCreate) {
        await tx.insert(orderItems).values({
          orderId: newOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,
        });

        await tx.update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(eq(products.id, item.productId));
      }

      return newOrder;
    });

    return NextResponse.json({ order: result });
  } catch (err) {
    console.error("Order creation failed", err);
    return NextResponse.json({ error: "Order processing failed" }, { status: 500 });
  }
}
