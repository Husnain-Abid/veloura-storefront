import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Category } from "@/models";

export async function GET() {
  try {
    await dbConnect();
    const allCategories = await Category.find({ parentId: null });
    
    const transformed = allCategories.map(c => {
      const obj = c.toObject();
      obj.id = obj._id.toString();
      return obj;
    });

    return NextResponse.json(transformed);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
