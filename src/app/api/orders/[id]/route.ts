import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Order } from "@/models";
import { getSession } from "@/lib/auth";

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "exchange",
] as const;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Check admin authentication
    const session = await getSession();

    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get request body
    const body = await req.json();
    const { status } = body;

    // Validate status
    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid status. Allowed statuses: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Find order
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Update status
    order.status = status;
    await order.save();

    const obj = order.toObject();

    obj.id = obj._id.toString();

    return NextResponse.json({
      message: "Order status updated successfully",
      order: obj,
    });
  } catch (error: any) {
    console.error("Update order status error:", error);

    return NextResponse.json(
      {
        error: error.message || "Failed to update order status",
      },
      { status: 500 }
    );
  }
}