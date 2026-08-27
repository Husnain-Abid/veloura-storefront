import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Review } from "@/models";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allReviews = await Review.find({})
      .sort({ createdAt: -1 })
      .populate("productId");

    const transformed = allReviews.map(r => {
      const obj = r.toObject();
      obj.id = obj._id.toString();
      return obj;
    });

    return NextResponse.json(transformed);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
