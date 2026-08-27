import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Order, Product, Coupon } from "@/models";
import { getSession } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getSession();
    // Support guest checkout by making session optional
    const userId = session?.id || null;

    const { items, shippingAddress, paymentMethod, couponId } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Recalculate everything on backend
    let subtotal = 0;
    const itemsToCreate = [];
    const productsToUpdate = [];

    for (const item of items) {
      const product = await Product.findById(item.id);

      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 404 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
      }

      if (item.quantity <= 0) {
        return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
      }

      const priceAtPurchase = product.salePrice || product.price;
      subtotal += priceAtPurchase * item.quantity;

      itemsToCreate.push({
        productId: product._id,
        quantity: item.quantity,
        price: priceAtPurchase,
        size: item.size,
        color: item.color,
      });

      productsToUpdate.push({
        id: product._id,
        quantity: item.quantity
      });
    }

    // Coupon logic
    let discountAmount = 0;
    if (couponId) {
      const coupon = await Coupon.findById(couponId);
      if (coupon && coupon.isActive && (!coupon.expiryDate || new Date(coupon.expiryDate) > new Date())) {
        if (subtotal >= (coupon.minOrderAmount || 0)) {
          if (coupon.discountType === "percentage") {
            discountAmount = (subtotal * coupon.discountValue) / 100;
          } else {
            discountAmount = coupon.discountValue;
          }
          // Increment usage count
          coupon.usageCount = (coupon.usageCount || 0) + 1;
          await coupon.save();
        }
      }
    }

    const shippingFee = subtotal >= 5000 ? 0 : 300;
    const total = subtotal + shippingFee - discountAmount;
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create Order and Update Stock
    // Using individual saves if transactions aren't supported in current cluster, 
    // but try-catch ensures we know if something fails.
    
    const newOrder = await Order.create({
      orderNumber,
      userId,
      subtotal,
      shippingFee,
      discountAmount,
      total: Math.max(0, total),
      paymentMethod,
      shippingAddress,
      couponId: couponId || null,
      items: itemsToCreate,
    });

    // Update stock after order success
    for (const pUpdate of productsToUpdate) {
      await Product.findByIdAndUpdate(pUpdate.id, {
        $inc: { stock: -pUpdate.quantity }
      });
    }

    const obj = newOrder.toObject();
    obj.id = obj._id.toString();

    return NextResponse.json({ order: obj });
  } catch (err: any) {
    console.error("Order creation failed", err);
    return NextResponse.json({ error: err.message || "Order processing failed" }, { status: 500 });
  }
}
