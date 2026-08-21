import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { isNull, eq } from "drizzle-orm";

export async function GET() {
  const allCategories = await db.query.categories.findMany({
    where: isNull(categories.parentId),
  });

  return NextResponse.json(allCategories);
}
