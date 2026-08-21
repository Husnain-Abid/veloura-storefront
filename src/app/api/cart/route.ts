import { NextResponse } from "next/server";
import { db } from "@/db";
import { carts } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json([]);

  const cartItems = await db.query.carts.findMany({
    where: eq(carts.userId, session.id),
    with: {
      product: true,
    }
  });

  return NextResponse.json(cartItems);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items } = await req.json();

  // Clear existing cart and replace with new items (simple sync strategy)
  await db.delete(carts).where(eq(carts.userId, session.id));

  if (items.length > 0) {
    await db.insert(carts).values(items.map((item: any) => ({
      userId: session.id,
      productId: item.id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    })));
  }

  return NextResponse.json({ success: true });
}
