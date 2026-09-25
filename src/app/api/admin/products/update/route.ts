import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Product } from "@/models";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request) {
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
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    /* =====================================================
       BODY
    ===================================================== */

    const body = await req.json();

    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    /* =====================================================
       FIND PRODUCT
    ===================================================== */

    const existingProduct =
      await Product.findById(id);

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found.",
        },
        { status: 404 }
      );
    }

    /* =====================================================
       NORMALIZE IMAGES
    ===================================================== */

    const images = Array.isArray(
      data.images
    )
      ? data.images
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
      : [];

    /* =====================================================
       NORMALIZE VARIANTS
    ===================================================== */

    const variants = Array.isArray(
      data.variants
    )
      ? data.variants
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
             * Save images belonging to
             * this specific color.
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
                    url: String(
                      image.url
                    ),
                    publicId: String(
                      image.publicId
                    ),
                  }))
              : [],

            /*
             * Sizes + stock
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

    const sizes = Array.isArray(
      data.sizes
    )
      ? Array.from(
          new Set(
            data.sizes
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

    const colors = Array.isArray(
      data.colors
    )
      ? data.colors
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

    const variantStock =
      variants.reduce(
        (
          total: number,
          variant: any
        ) => {
          return (
            total +
            variant.sizes.reduce(
              (
                sizeTotal: number,
                size: any
              ) => {
                return (
                  sizeTotal +
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
            Number(data.stock || 0)
          );

    /* =====================================================
       UPDATE DATA
    ===================================================== */

    const updateData = {
      name:
        data.name?.trim(),

      slug:
        data.slug?.trim(),

      description:
        data.description?.trim() || "",

      price:
        Number(data.price),

      salePrice:
        data.salePrice !==
          undefined &&
        data.salePrice !== null &&
        data.salePrice !== ""
          ? Number(
              data.salePrice
            )
          : null,

      images,

      stock:
        totalStock,

      categoryId:
        data.categoryId,

      material:
        data.material?.trim() || "",

      careInstructions:
        data.careInstructions?.trim() ||
        "",

      /*
       * Legacy fields
       */
      sizes,

      colors,

      /*
       * IMPORTANT:
       * Save complete variants
       * including images.
       */
      variants,

      isFeatured:
        Boolean(
          data.isFeatured
        ),

      isNewArrival:
        Boolean(
          data.isNewArrival
        ),

      isBestSeller:
        Boolean(
          data.isBestSeller
        ),

      isFlashSale:
        Boolean(
          data.isFlashSale
        ),
    };

    /* =====================================================
       UPDATE
    ===================================================== */

    const updatedProduct =
      await Product.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedProduct) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found.",
        },
        { status: 404 }
      );
    }

    /* =====================================================
       RESPONSE
    ===================================================== */

    const obj =
      updatedProduct.toObject();

    obj.id =
      obj._id.toString();

    delete obj._id;
    delete obj.__v;

    return NextResponse.json(
      {
        success: true,
        message:
          "Product updated successfully.",
        product: obj,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(
      "UPDATE PRODUCT ERROR:",
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
          field:
            duplicateField,
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

    return NextResponse.json(
      {
        success: false,
        error:
          err?.message ||
          "Failed to update product.",
      },
      { status: 500 }
    );
  }
}