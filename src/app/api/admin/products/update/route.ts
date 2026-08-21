import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...data } = body;

    const [updatedProduct] = await db.update(products)
      .set({
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price.toString(),
        salePrice: data.salePrice ? data.salePrice.toString() : null,
        stock: parseInt(data.stock),
        categoryId: data.categoryId || null,
        material: data.material,
        careInstructions: data.careInstructions,
        images: data.images,
        sizes: data.sizes,
        colors: data.colors,
        isFeatured: data.isFeatured,
        isNewArrival: data.isNewArrival,
        isBestSeller: data.isBestSeller,
        isFlashSale: data.isFlashSale,
      })
      .where(eq(products.id, id))
      .returning();

    return NextResponse.json(updatedProduct);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
