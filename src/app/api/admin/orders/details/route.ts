import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Order } from "@/models";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await Order.findById(id)
      .populate("userId")
      .populate("items.productId");

    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const obj = order.toObject();
    obj.id = obj._id.toString();

    return NextResponse.json(obj);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
