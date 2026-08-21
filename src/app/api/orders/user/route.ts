import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, session.id),
    orderBy: [desc(orders.createdAt)],
    with: {
      items: true,
    },
  });

  return NextResponse.json(userOrders);
}
