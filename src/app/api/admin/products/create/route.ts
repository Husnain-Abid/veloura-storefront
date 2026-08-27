import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Product } from "@/models";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const newProduct = await Product.create({
      ...body,
      price: Number(body.price),
      salePrice: body.salePrice ? Number(body.salePrice) : null,
      stock: Number(body.stock),
    });

    const obj = newProduct.toObject();
    obj.id = obj._id.toString();

    return NextResponse.json(obj);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
