import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Product } from "@/models";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await dbConnect();

    /* =====================================================
       AUTH
    ===================================================== */

    const session = await getSession();

    if (!session || session.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          error: "You are not authorized to create a product.",
        },
        { status: 401 }
      );
    }

    /* =====================================================
       BODY
    ===================================================== */

    const body = await req.json();

    /* =====================================================
       BASIC VALIDATION
    ===================================================== */

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Product name is required.",
          field: "name",
        },
        { status: 400 }
      );
    }

    if (!body.slug || !body.slug.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Product slug is required.",
          field: "slug",
        },
        { status: 400 }
      );
    }

    if (!body.price || Number(body.price) <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid product price.",
          field: "price",
        },
        { status: 400 }
      );
    }

    if (!body.categoryId) {
      return NextResponse.json(
        {
          success: false,
          error: "Please select a category.",
          field: "categoryId",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       DUPLICATE NAME
    ===================================================== */

    const existingProduct = await Product.findOne({
      name: body.name.trim(),
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: `A product with the name "${body.name.trim()}" already exists.`,
          field: "name",
        },
        { status: 409 }
      );
    }

    /* =====================================================
       DUPLICATE SLUG
    ===================================================== */

    const existingSlug = await Product.findOne({
      slug: body.slug.trim(),
    });

    if (existingSlug) {
      return NextResponse.json(
        {
          success: false,
          error: `A product with the slug "${body.slug.trim()}" already exists.`,
          field: "slug",
        },
        { status: 409 }
      );
    }

    /* =====================================================
       NORMALIZE IMAGES
    ===================================================== */

    const images = Array.isArray(body.images)
      ? body.images
          .filter(
            (image: any) =>
              image?.url && image?.publicId
          )
          .map((image: any) => ({
            url: String(image.url),
            publicId: String(image.publicId),
          }))
      : [];

    /* =====================================================
       NORMALIZE VARIANTS
    ===================================================== */

    const variants = Array.isArray(body.variants)
      ? body.variants
          .filter(
            (variant: any) =>
              variant?.color?.name?.trim()
          )
          .map((variant: any) => ({
            color: {
              name: String(
                variant.color.name
              ).trim(),

              hex:
                typeof variant.color.hex ===
                "string"
                  ? variant.color.hex
                  : "#000000",
            },

            /*
             * IMPORTANT:
             * Variant-specific images
             */
            images: Array.isArray(
              variant.images
            )
              ? variant.images
                  .filter(
                    (image: any) =>
                      image?.url &&
                      image?.publicId
                  )
                  .map((image: any) => ({
                    url: String(image.url),
                    publicId: String(
                      image.publicId
                    ),
                  }))
              : [],

            /*
             * Variant sizes + stock
             */
            sizes: Array.isArray(
              variant.sizes
            )
              ? variant.sizes
                  .filter(
                    (size: any) =>
                      size?.size?.trim()
                  )
                  .map((size: any) => ({
                    size: String(
                      size.size
                    ).trim(),

                    stock: Math.max(
                      0,
                      Number(
                        size.stock || 0
                      )
                    ),
                  }))
              : [],
          }))
      : [];

    /* =====================================================
       LEGACY SIZES
    ===================================================== */

    const sizes = Array.isArray(body.sizes)
      ? Array.from(
          new Set(
            body.sizes
              .map((size: any) =>
                String(size).trim()
              )
              .filter(Boolean)
          )
        )
      : [];

    /* =====================================================
       LEGACY COLORS
    ===================================================== */

    const colors = Array.isArray(body.colors)
      ? body.colors
          .filter(
            (color: any) =>
              color?.name?.trim()
          )
          .map((color: any) => ({
            name: String(
              color.name
            ).trim(),

            hex:
              typeof color.hex ===
              "string"
                ? color.hex
                : "#000000",
          }))
      : [];

    /* =====================================================
       TOTAL STOCK
    ===================================================== */

    const variantStock = variants.reduce(
      (total: number, variant: any) => {
        return (
          total +
          variant.sizes.reduce(
            (
              variantTotal: number,
              size: any
            ) => {
              return (
                variantTotal +
                Number(
                  size.stock || 0
                )
              );
            },
            0
          )
        );
      },
      0
    );

    const totalStock =
      variants.length > 0
        ? variantStock
        : Math.max(
            0,
            Number(body.stock || 0)
          );

    /* =====================================================
       CREATE PRODUCT
    ===================================================== */

    const newProduct =
      await Product.create({
        name: body.name.trim(),

        slug: body.slug.trim(),

        description:
          body.description?.trim() || "",

        price: Number(body.price),

        salePrice:
          body.salePrice !==
            undefined &&
          body.salePrice !== null &&
          body.salePrice !== ""
            ? Number(body.salePrice)
            : null,

        /*
         * General product images
         */
        images,

        /*
         * Total inventory
         */
        stock: totalStock,

        categoryId: body.categoryId,

        material:
          body.material?.trim() || "",

        careInstructions:
          body.careInstructions?.trim() || "",

        /*
         * Legacy fields
         */
        sizes,

        colors,

        /*
         * IMPORTANT:
         * Full variants including images
         */
        variants,

        isFeatured:
          Boolean(body.isFeatured),

        isNewArrival:
          Boolean(body.isNewArrival),

        isBestSeller:
          Boolean(body.isBestSeller),

        isFlashSale:
          Boolean(body.isFlashSale),
      });

    /* =====================================================
       RESPONSE
    ===================================================== */

    const obj =
      newProduct.toObject();

    obj.id =
      obj._id.toString();

    delete obj._id;
    delete obj.__v;

    return NextResponse.json(
      {
        success: true,
        message:
          "Product created successfully.",
        product: obj,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(
      "CREATE PRODUCT ERROR:",
      err
    );

    /* =====================================================
       DUPLICATE KEY
    ===================================================== */

    if (err?.code === 11000) {
      const duplicateField =
        Object.keys(
          err.keyPattern || {}
        )[0];

      let message =
        "A product with this information already exists.";

      if (
        duplicateField === "name"
      ) {
        message =
          "A product with this name already exists.";
      }

      if (
        duplicateField === "slug"
      ) {
        message =
          "A product with this slug already exists.";
      }

      return NextResponse.json(
        {
          success: false,
          error: message,
          field: duplicateField,
        },
        { status: 409 }
      );
    }

    /* =====================================================
       MONGOOSE VALIDATION
    ===================================================== */

    if (
      err?.name ===
      "ValidationError"
    ) {
      const errors =
        Object.values(
          err.errors || {}
        ).map(
          (error: any) =>
            error.message
        );

      return NextResponse.json(
        {
          success: false,
          error:
            errors.length > 0
              ? errors.join(" ")
              : "Please check the product information.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       GENERAL ERROR
    ===================================================== */

    return NextResponse.json(
      {
        success: false,
        error:
          err?.message ||
          "Something went wrong while creating the product.",
      },
      { status: 500 }
    );
  }
}