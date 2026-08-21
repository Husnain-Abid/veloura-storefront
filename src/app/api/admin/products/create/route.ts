import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const [newProduct] = await db.insert(products).values({
      name: body.name,
      slug: body.slug,
      description: body.description,
      price: body.price.toString(),
      salePrice: body.salePrice ? body.salePrice.toString() : null,
      stock: parseInt(body.stock),
      categoryId: body.categoryId || null,
      material: body.material,
      careInstructions: body.careInstructions,
      images: body.images,
      sizes: body.sizes,
      colors: body.colors,
      isFeatured: body.isFeatured,
      isNewArrival: body.isNewArrival,
      isBestSeller: body.isBestSeller,
      isFlashSale: body.isFlashSale,
    }).returning();

    return NextResponse.json(newProduct);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
