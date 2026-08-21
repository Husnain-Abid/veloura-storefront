import { NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, and, gte, lte, or, ilike, desc, asc } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const q = searchParams.get("q");
  const sort = searchParams.get("sort");
  const limit = parseInt(searchParams.get("limit") || "12");
  const offset = parseInt(searchParams.get("offset") || "0");

  let conditions = [];

  if (category) {
    const cat = await db.query.categories.findFirst({
      where: eq(categories.slug, category),
    });
    if (cat) {
      conditions.push(eq(products.categoryId, cat.id));
    }
  }

  if (minPrice) {
    conditions.push(gte(products.price, minPrice));
  }
  if (maxPrice) {
    conditions.push(lte(products.price, maxPrice));
  }
  if (q) {
    conditions.push(or(ilike(products.name, `%${q}%`), ilike(products.description, `%${q}%`)));
  }

  const orderBy = sort === "price-low" 
    ? [asc(products.price)] 
    : sort === "price-high" 
    ? [desc(products.price)] 
    : [desc(products.createdAt)];

  const results = await db.select().from(products)
    .where(and(...conditions))
    .orderBy(...orderBy)
    .limit(limit)
    .offset(offset);
  
  return NextResponse.json(results);
}
