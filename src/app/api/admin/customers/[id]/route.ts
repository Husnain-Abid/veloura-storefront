import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User, Order } from "@/models";
import { getSession } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Check admin session
    const session = await getSession();

    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid customer ID" },
        { status: 400 }
      );
    }

    // Find customer
    const customer = await User.findOne({
      _id: id,
      role: "customer",
    }).lean();

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    // Find customer's orders
    const orders = await Order.find({
      userId: id,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "items.productId",
        select: "name images variants price",
      })
      .lean();

    return NextResponse.json({
      customer: {
        id: customer._id.toString(),
        name: customer.name,
        email: customer.email,
        role: customer.role,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      },

      orders: orders.map((order: any) => ({
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        total: order.total,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        discountAmount: order.discountAmount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,

        items: order.items?.map((item: any) => ({
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          color: item.color,

          productId: item.productId
            ? {
                id: item.productId._id?.toString(),
                name: item.productId.name,
                images: item.productId.images || [],
                variants: item.productId.variants || [],
                price: item.productId.price,
              }
            : null,
        })) || [],
      })),
    });
  } catch (error) {
    console.error("GET CUSTOMER DETAILS ERROR:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}