import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Product } from "@/models";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...data } = body;

    const updatedProduct = await Product.findByIdAndUpdate(id, {
      ...data,
      price: Number(data.price),
      salePrice: data.salePrice ? Number(data.salePrice) : null,
      stock: Number(data.stock),
    }, { new: true });

    if (!updatedProduct) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const obj = updatedProduct.toObject();
    obj.id = obj._id.toString();

    return NextResponse.json(obj);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
