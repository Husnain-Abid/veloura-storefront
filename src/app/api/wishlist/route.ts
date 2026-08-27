import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Wishlist } from "@/models";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session) return NextResponse.json([]);

    const items = await Wishlist.find({ userId: session.id }).populate("productId");

    const transformed = items.map(i => {
      const obj = i.toObject();
      obj.id = obj._id.toString();
      return obj;
    });

    return NextResponse.json(transformed);
  } catch (err) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { items } = await req.json();

    await Wishlist.deleteMany({ userId: session.id });

    if (items.length > 0) {
      await Wishlist.insertMany(items.map((item: any) => ({
        userId: session.id,
        productId: item.id,
      })));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
  }
}
