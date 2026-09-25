import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Category } from "@/models";
import { getSession } from "@/lib/auth";

/* -------------------------------------------------------------------------- */
/* GET /api/categories                                                        */
/* -------------------------------------------------------------------------- */

export async function GET() {
  try {
    await dbConnect();

    const categories = await Category.find({})
      .sort({ createdAt: -1 })
      .lean();

    const formattedCategories = categories.map((category: any) => ({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image: category.image || "",
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch categories",
      },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------------------------------- */
/* POST /api/categories                                                       */
/* -------------------------------------------------------------------------- */

export async function POST(req: Request) {
  try {
    await dbConnect();

    /* ----------------------------- Admin Check ---------------------------- */

    const session = await getSession();

    if (!session || session.role !== "admin") {
      return NextResponse.json(
        {
          error: "Unauthorized. Admin access required.",
        },
        { status: 401 }
      );
    }

    /* ------------------------------- Body -------------------------------- */

    const body = await req.json();

    const name = body.name?.trim();
    const description = body.description?.trim() || "";
    const image = body.image?.trim() || "";

    if (!name) {
      return NextResponse.json(
        {
          error: "Category name is required.",
        },
        { status: 400 }
      );
    }

    /* ------------------------------- Slug -------------------------------- */

    const slug =
      body.slug?.trim() ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    /* -------------------------- Duplicate Check -------------------------- */

    const existingCategory = await Category.findOne({
      $or: [
        { name: { $regex: `^${escapeRegex(name)}$`, $options: "i" } },
        { slug: slug },
      ],
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          error:
            existingCategory.slug === slug
              ? "A category with this name or slug already exists."
              : "A category with this name already exists.",
        },
        { status: 409 }
      );
    }

    /* ---------------------------- Create --------------------------------- */

    const category = await Category.create({
      name,
      slug,
      description,
      image,
    });

    return NextResponse.json(
      {
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        image: category.image || "",
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("CREATE CATEGORY ERROR:", error);

    /* Mongo duplicate key error */
    if (error?.code === 11000) {
      return NextResponse.json(
        {
          error: "A category with this name or slug already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create category.",
      },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}