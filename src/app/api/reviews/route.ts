import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews, products } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, rating, comment, userName } = await req.json();

    const [newReview] = await db.insert(reviews).values({
      productId,
      userId: session.id,
      userName,
      rating,
      comment,
      isApproved: false, // Requires admin approval
    }).returning();

    return NextResponse.json(newReview);
  } catch (err) {
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
