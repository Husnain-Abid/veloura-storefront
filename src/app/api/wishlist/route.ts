import { NextResponse } from "next/server";
import { db } from "@/db";
import { wishlists } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json([]);

  const items = await db.query.wishlists.findMany({
    where: eq(wishlists.userId, session.id),
    with: {
      product: true,
    }
  });

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items } = await req.json();

  await db.delete(wishlists).where(eq(wishlists.userId, session.id));

  if (items.length > 0) {
    await db.insert(wishlists).values(items.map((item: any) => ({
      userId: session.id,
      productId: item.id,
    })));
  }

  return NextResponse.json({ success: true });
}
