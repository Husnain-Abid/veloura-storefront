import { NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { code, amount } = await req.json();

    const coupon = await db.query.coupons.findFirst({
      where: eq(coupons.code, code),
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid or inactive coupon" }, { status: 404 });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    if (coupon.minOrderAmount && amount < Number(coupon.minOrderAmount)) {
      return NextResponse.json({ 
        error: `Minimum order amount of PKR ${coupon.minOrderAmount} required` 
      }, { status: 400 });
    }

    return NextResponse.json(coupon);
  } catch (err) {
    return NextResponse.json({ error: "Coupon validation failed" }, { status: 500 });
  }
}
