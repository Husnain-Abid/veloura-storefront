import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Category, Product } from "@/models";
import { getSession } from "@/lib/auth";

/* -------------------------------------------------------------------------- */
/* PUT /api/categories/:id                                                    */
/* -------------------------------------------------------------------------- */

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

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

    /* -------------------------- Current Category ------------------------- */

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        {
          error: "Category not found.",
        },
        { status: 404 }
      );
    }

    /* -------------------------- Duplicate Check -------------------------- */

    const duplicate = await Category.findOne({
      _id: { $ne: id },
      $or: [
        {
          name: {
            $regex: `^${escapeRegex(name)}$`,
            $options: "i",
          },
        },
        {
          slug,
        },
      ],
    });

    if (duplicate) {
      return NextResponse.json(
        {
          error: "Another category with this name or slug already exists.",
        },
        { status: 409 }
      );
    }

    /* ------------------------------- Update ------------------------------- */

    category.name = name;
    category.slug = slug;
    category.description = description;
    category.image = image;

    await category.save();

    return NextResponse.json({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image: category.image || "",
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  } catch (error: any) {
    console.error("UPDATE CATEGORY ERROR:", error);

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
        error: "Failed to update category.",
      },
      { status: 500 }
    );
  }
}

/* -------------------------------------------------------------------------- */
/* DELETE /api/categories/:id                                                 */
/* -------------------------------------------------------------------------- */

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    /* -------------------------- Check Category --------------------------- */

    const category = await Category.findById(id);

    if (!category) {
      return NextResponse.json(
        {
          error: "Category not found.",
        },
        { status: 404 }
      );
    }

    /* ---------------------------------------------------------------------- */
    /* Check whether products are using this category                         */
    /* ---------------------------------------------------------------------- */

    const productsUsingCategory = await Product.countDocuments({
      category: id,
    });

    if (productsUsingCategory > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete this category because ${productsUsingCategory} product${
            productsUsingCategory === 1 ? "" : "s"
          } ${
            productsUsingCategory === 1 ? "is" : "are"
          } using it.`,
        },
        { status: 409 }
      );
    }

    /* ------------------------------- Delete ------------------------------- */

    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully.",
      id,
    });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to delete category.",
      },
      { status: 500 }
    );
  }
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}