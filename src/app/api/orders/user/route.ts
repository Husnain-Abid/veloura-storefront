import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Order } from "@/models";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userOrders = await Order.find({ userId: session.id })
      .sort({ createdAt: -1 })
      .populate("items.productId");

    const transformed = userOrders.map(o => {
      const obj = o.toObject();
      obj.id = obj._id.toString();
      return obj;
    });

    return NextResponse.json(transformed);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
