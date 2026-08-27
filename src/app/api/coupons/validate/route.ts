import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Coupon } from "@/models";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { code, amount } = await req.json();

    const coupon = await Coupon.findOne({ code });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid or inactive coupon" }, { status: 404 });
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    if (coupon.usageLimit && (coupon.usageCount || 0) >= coupon.usageLimit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    if (coupon.minOrderAmount && amount < coupon.minOrderAmount) {
      return NextResponse.json({ 
        error: `Minimum order amount of PKR ${coupon.minOrderAmount} required` 
      }, { status: 400 });
    }

    const obj = coupon.toObject();
    obj.id = obj._id.toString();

    return NextResponse.json(obj);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Coupon validation failed" }, { status: 500 });
  }
}
