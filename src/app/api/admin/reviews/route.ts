import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { desc } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allReviews = await db.query.reviews.findMany({
    orderBy: [desc(reviews.createdAt)],
    with: {
      product: true,
    },
  });

  return NextResponse.json(allReviews);
}
