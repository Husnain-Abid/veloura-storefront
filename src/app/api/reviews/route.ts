import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Review } from "@/models";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating, comment, userName } = await req.json();

    const newReview = await Review.create({
      productId,
      userId: session.id,
      userName,
      rating,
      comment,
      isApproved: false,
    });

    const obj = newReview.toObject();
    obj.id = obj._id.toString();

    return NextResponse.json(obj);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
