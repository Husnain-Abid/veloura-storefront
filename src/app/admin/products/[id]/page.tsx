"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  Check,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import Link from "next/link";

/* =========================================================
   TYPES
========================================================= */

type ProductImage = {
  url: string;
  publicId: string;
  _id?: string;
};

type VariantSize = {
  id: string;
  size: string;
  stock: string;
};

type ProductVariant = {
  id: string;
  colorName: string;
  colorHex: string;
  images: ProductImage[];
  sizes: VariantSize[];
};

type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  price: string;
  salePrice: string;
  stock: string;
  categoryId: string;
  material: string;
  careInstructions: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isFlashSale: boolean;
};

/* =========================================================
   VALIDATION
========================================================= */

const ProductSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),

  slug: Yup.string().required("Slug is required"),

  description: Yup.string().required(
    "Description is required"
  ),

  price: Yup.number()
    .positive("Price must be positive")
    .required("Price is required"),

  salePrice: Yup.number()
    .nullable()
    .moreThan(0, "Sale price must be positive"),

  stock: Yup.number()
    .integer("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .required("Stock is required"),

  categoryId: Yup.string().required(
    "Please select a category"
  ),
});

/* =========================================================
   HELPERS
========================================================= */

const createId = () => {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
};

const emptyVariant = (): ProductVariant => ({
  id: createId(),
  colorName: "",
  colorHex: "#000000",
  images: [],
  sizes: [],
});

/* =========================================================
   COMPONENT
========================================================= */

export default function ProductEditor() {
  const router = useRouter();
  const params = useParams();

  const id = params?.id as string;

  const isEdit = Boolean(id && id !== "new");

  const [loading, setLoading] = useState(isEdit);

  const [uploadingVariantId, setUploadingVariantId] =
    useState<string | null>(null);

  const [categories, setCategories] = useState<any[]>([]);

  const [images, setImages] = useState<ProductImage[]>(
    []
  );

  const [variants, setVariants] = useState<
    ProductVariant[]
  >([]);

  const [initialValues, setInitialValues] =
    useState<ProductFormValues>({
      name: "",
      slug: "",
      description: "",
      price: "",
      salePrice: "",
      stock: "0",
      categoryId: "",
      material: "",
      careInstructions: "",
      isFeatured: false,
      isNewArrival: true,
      isBestSeller: false,
      isFlashSale: false,
    });

  /* =======================================================
     FETCH DATA
  ======================================================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        /* -----------------------------------------------
           CATEGORIES
        ------------------------------------------------ */

        const categoriesRes = await fetch(
          "/api/categories"
        );

        if (!categoriesRes.ok) {
          throw new Error(
            "Failed to load categories"
          );
        }

        const categoriesData =
          await categoriesRes.json();

        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData
            : []
        );

        /* -----------------------------------------------
           PRODUCT
        ------------------------------------------------ */

        if (isEdit) {
          const productRes = await fetch(
            `/api/products/details?id=${encodeURIComponent(
              id
            )}`
          );

          if (!productRes.ok) {
            throw new Error(
              "Failed to load product"
            );
          }

          const product =
            await productRes.json();

          setInitialValues({
            name: product.name || "",

            slug: product.slug || "",

            description:
              product.description || "",

            price:
              product.price !== undefined &&
              product.price !== null
                ? String(product.price)
                : "",

            salePrice:
              product.salePrice !== undefined &&
              product.salePrice !== null
                ? String(product.salePrice)
                : "",

            stock:
              product.stock !== undefined &&
              product.stock !== null
                ? String(product.stock)
                : "0",

            categoryId:
              product.categoryId?._id?.toString() ||
              product.categoryId?.toString() ||
              "",

            material:
              product.material || "",

            careInstructions:
              product.careInstructions || "",

            isFeatured:
              Boolean(product.isFeatured),

            isNewArrival:
              product.isNewArrival !== undefined
                ? Boolean(product.isNewArrival)
                : true,

            isBestSeller:
              Boolean(product.isBestSeller),

            isFlashSale:
              Boolean(product.isFlashSale),
          });

          /* ---------------------------------------------
             PRODUCT LEVEL IMAGES
          ---------------------------------------------- */

          setImages(
            Array.isArray(product.images)
              ? product.images
              : []
          );

          /* ---------------------------------------------
             VARIANTS
          ---------------------------------------------- */

          if (
            Array.isArray(product.variants) &&
            product.variants.length > 0
          ) {
            setVariants(
              product.variants.map(
                (variant: any) => ({
                  id:
                    variant._id?.toString() ||
                    createId(),

                  colorName:
                    variant.color?.name || "",

                  colorHex:
                    variant.color?.hex ||
                    "#000000",

                  images:
                    Array.isArray(
                      variant.images
                    )
                      ? variant.images
                      : [],

                  sizes:
                    Array.isArray(
                      variant.sizes
                    )
                      ? variant.sizes.map(
                          (size: any) => ({
                            id:
                              size._id?.toString() ||
                              createId(),

                            size:
                              size.size || "",

                            stock:
                              String(
                                size.stock ?? 0
                              ),
                          })
                        )
                      : [],
                })
              )
            );
          } else {
            /*
             * If an old product has sizes/colors
             * but no variants, create a simple
             * compatibility variant.
             */

            const oldColors =
              Array.isArray(product.colors)
                ? product.colors
                : [];

            const oldSizes =
              Array.isArray(product.sizes)
                ? product.sizes
                : [];

            if (
              oldColors.length > 0 ||
              oldSizes.length > 0
            ) {
              setVariants(
                oldColors.map(
                  (color: any) => ({
                    id: createId(),

                    colorName:
                      color.name || "",

                    colorHex:
                      color.hex ||
                      "#000000",

                    images: [],

                    sizes:
                      oldSizes.map(
                        (size: string) => ({
                          id: createId(),
                          size,
                          stock: "0",
                        })
                      ),
                  })
                )
              );
            }
          }
        }
      } catch (error) {
        console.error(
          "Failed to load product data:",
          error
        );

        toast.error(
          "Failed to load product data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEdit]);

  /* =======================================================
     PRODUCT LEVEL IMAGE UPLOAD
  ======================================================= */

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select an image file"
      );

      e.target.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Image size must be less than 5MB"
      );

      e.target.value = "";

      return;
    }

    try {
      setUploadingVariantId("main");

      const reader = new FileReader();

      reader.onloadend = async () => {
        try {
          const base64data =
            reader.result;

          if (
            typeof base64data !==
            "string"
          ) {
            toast.error(
              "Failed to read image"
            );

            return;
          }

          const res = await fetch(
            "/api/admin/upload",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                file: base64data,
              }),
            }
          );

          const data =
            await res.json();

          if (!res.ok) {
            toast.error(
              data.error ||
                "Image upload failed"
            );

            return;
          }

          if (
            !data.url ||
            !data.publicId
          ) {
            toast.error(
              "Invalid upload response"
            );

            return;
          }

          setImages((prev) => [
            ...prev,

            {
              url: data.url,
              publicId:
                data.publicId,
            },
          ]);

          toast.success(
            "Image uploaded successfully"
          );
        } catch (error) {
          console.error(
            "Image upload error:",
            error
          );

          toast.error(
            "Image upload failed"
          );
        } finally {
          setUploadingVariantId(
            null
          );
        }
      };

      reader.onerror = () => {
        toast.error(
          "Failed to read image"
        );

        setUploadingVariantId(null);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(
        "File upload error:",
        error
      );

      toast.error(
        "Something went wrong while uploading"
      );

      setUploadingVariantId(null);
    }

    e.target.value = "";
  };

  /* =======================================================
     VARIANT IMAGE UPLOAD
  ======================================================= */

  const handleVariantImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    variantId: string
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Please select an image file"
      );

      e.target.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Image size must be less than 5MB"
      );

      e.target.value = "";

      return;
    }

    try {
      setUploadingVariantId(
        variantId
      );

      const reader = new FileReader();

      reader.onloadend = async () => {
        try {
          const base64data =
            reader.result;

          if (
            typeof base64data !==
            "string"
          ) {
            toast.error(
              "Failed to read image"
            );

            return;
          }

          const res = await fetch(
            "/api/admin/upload",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                file: base64data,
              }),
            }
          );

          const data =
            await res.json();

          if (!res.ok) {
            toast.error(
              data.error ||
                "Image upload failed"
            );

            return;
          }

          if (
            !data.url ||
            !data.publicId
          ) {
            toast.error(
              "Invalid upload response"
            );

            return;
          }

          setVariants((prev) =>
            prev.map((variant) =>
              variant.id ===
              variantId
                ? {
                    ...variant,

                    images: [
                      ...variant.images,

                      {
                        url: data.url,
                        publicId:
                          data.publicId,
                      },
                    ],
                  }
                : variant
            )
          );

          toast.success(
            "Variant image uploaded"
          );
        } catch (error) {
          console.error(
            "Variant image upload error:",
            error
          );

          toast.error(
            "Image upload failed"
          );
        } finally {
          setUploadingVariantId(
            null
          );
        }
      };

      reader.onerror = () => {
        toast.error(
          "Failed to read image"
        );

        setUploadingVariantId(null);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(
        "Variant upload error:",
        error
      );

      toast.error(
        "Something went wrong while uploading"
      );

      setUploadingVariantId(null);
    }

    e.target.value = "";
  };

  /* =======================================================
     REMOVE PRODUCT IMAGE
  ======================================================= */

  const handleRemoveImage = (
    index: number
  ) => {
    setImages((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  /* =======================================================
     REMOVE VARIANT IMAGE
  ======================================================= */

  const handleRemoveVariantImage = (
    variantId: string,
    imageIndex: number
  ) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,

              images:
                variant.images.filter(
                  (_, i) =>
                    i !== imageIndex
                ),
            }
          : variant
      )
    );
  };

  /* =======================================================
     ADD VARIANT
  ======================================================= */

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      emptyVariant(),
    ]);
  };

  /* =======================================================
     REMOVE VARIANT
  ======================================================= */

  const removeVariant = (
    variantId: string
  ) => {
    setVariants((prev) =>
      prev.filter(
        (variant) =>
          variant.id !== variantId
      )
    );
  };

  /* =======================================================
     UPDATE VARIANT
  ======================================================= */

  const updateVariant = (
    variantId: string,
    field:
      | "colorName"
      | "colorHex",
    value: string
  ) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      )
    );
  };

  /* =======================================================
     ADD SIZE
  ======================================================= */

  const addSize = (
    variantId: string
  ) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,

              sizes: [
                ...variant.sizes,

                {
                  id: createId(),
                  size: "",
                  stock: "0",
                },
              ],
            }
          : variant
      )
    );
  };

  /* =======================================================
     REMOVE SIZE
  ======================================================= */

  const removeSize = (
    variantId: string,
    sizeId: string
  ) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,

              sizes:
                variant.sizes.filter(
                  (size) =>
                    size.id !== sizeId
                ),
            }
          : variant
      )
    );
  };

  /* =======================================================
     UPDATE SIZE
  ======================================================= */

  const updateSize = (
    variantId: string,
    sizeId: string,
    field: "size" | "stock",
    value: string
  ) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,

              sizes:
                variant.sizes.map(
                  (size) =>
                    size.id === sizeId
                      ? {
                          ...size,
                          [field]:
                            value,
                        }
                      : size
                ),
            }
          : variant
      )
    );
  };

  /* =======================================================
     TOTAL VARIANT STOCK
  ======================================================= */

  const calculateVariantStock = () => {
    return variants.reduce(
      (total, variant) => {
        return (
          total +
          variant.sizes.reduce(
            (sum, size) =>
              sum +
              Number(size.stock || 0),
            0
          )
        );
      },
      0
    );
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="p-24 text-center">
        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4" />

        <p className="text-sm text-gray-500">
          Loading product data...
        </p>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-center justify-between">

        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />

          Back to Products
        </Link>

        <h1 className="text-2xl font-serif">
          {isEdit
            ? "Edit Product"
            : "Add New Product"}
        </h1>
      </div>

      {/* =================================================
          FORMIK
      ================================================= */}

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={ProductSchema}
        onSubmit={async (
          values,
          { setSubmitting }
        ) => {
          const url = isEdit
            ? "/api/admin/products/update"
            : "/api/admin/products/create";

          const method = isEdit
            ? "PUT"
            : "POST";

          try {
            /*
             * Convert UI variants into
             * database variants.
             */

            const databaseVariants =
              variants
                .filter(
                  (variant) =>
                    variant.colorName.trim()
                )
                .map((variant) => ({
                  color: {
                    name:
                      variant.colorName.trim(),

                    hex:
                      variant.colorHex ||
                      "#000000",
                  },

                  images:
                    variant.images.map(
                      (image) => ({
                        url: image.url,
                        publicId:
                          image.publicId,
                      })
                    ),

                  sizes:
                    variant.sizes
                      .filter(
                        (size) =>
                          size.size.trim()
                      )
                      .map((size) => ({
                        size:
                          size.size.trim(),

                        stock: Number(
                          size.stock || 0
                        ),
                      })),
                }));

            /*
             * Create unique legacy sizes.
             */

            const legacySizes = Array.from(
              new Set(
                variants.flatMap(
                  (variant) =>
                    variant.sizes
                      .map(
                        (size) =>
                          size.size.trim()
                      )
                      .filter(Boolean)
                )
              )
            );

            /*
             * Create legacy colors.
             */

            const legacyColors =
              variants
                .filter(
                  (variant) =>
                    variant.colorName.trim()
                )
                .map((variant) => ({
                  name:
                    variant.colorName.trim(),

                  hex:
                    variant.colorHex ||
                    "#000000",
                }));

            /*
             * Product-level stock.
             *
             * If variants exist, calculate
             * stock from variant sizes.
             *
             * Otherwise use the manual
             * stock field.
             */

            const totalVariantStock =
              calculateVariantStock();

            const hasVariants =
              databaseVariants.length >
              0;

            const payload = {
              ...values,

              price: Number(
                values.price
              ),

              salePrice:
                values.salePrice === ""
                  ? null
                  : Number(
                      values.salePrice
                    ),

              stock: hasVariants
                ? totalVariantStock
                : Number(
                    values.stock
                  ),

              images,

              sizes: legacySizes,

              colors: legacyColors,

              variants:
                databaseVariants,

              id: isEdit
                ? id
                : undefined,
            };

            const res = await fetch(
              url,
              {
                method,

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify(
                  payload
                ),
              }
            );

            const data =
              await res.json();

            if (!res.ok) {
              toast.error(
                data.error ||
                  "Failed to save product"
              );

              return;
            }

            toast.success(
              isEdit
                ? "Product updated successfully"
                : "Product created successfully"
            );

            router.push(
              "/admin/products"
            );

            router.refresh();
          } catch (error) {
            console.error(
              "Save product error:",
              error
            );

            toast.error(
              "Something went wrong while saving the product"
            );
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({
          isSubmitting,
          setFieldValue,
        }) => (
          <Form className="space-y-8">

            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">

              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* NAME */}

                <div className="space-y-2">

                  <label className="text-[10px] font-bold uppercase tracking-widest">
                    Product Name
                  </label>

                  <Field
                    name="name"
                    onChange={(
                      e: React.ChangeEvent<HTMLInputElement>
                    ) => {
                      const value =
                        e.target.value;

                      setFieldValue(
                        "name",
                        value
                      );

                      const slug =
                        value
                          .toLowerCase()
                          .trim()
                          .replace(
                            /[^a-z0-9]+/g,
                            "-"
                          )
                          .replace(
                            /^-+|-+$/g,
                            ""
                          );

                      setFieldValue(
                        "slug",
                        slug
                      );
                    }}
                    className="w-full p-4 text-sm border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-black rounded-lg transition-all"
                  />

                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-[10px] uppercase font-bold"
                  />

                </div>

                {/* SLUG */}

                <div className="space-y-2">

                  <label className="text-[10px] font-bold uppercase tracking-widest">
                    Slug (URL)
                  </label>

                  <Field
                    name="slug"
                    className="w-full p-4 text-sm border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-black rounded-lg transition-all"
                  />

                  <ErrorMessage
                    name="slug"
                    component="div"
                    className="text-red-500 text-[10px] uppercase font-bold"
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="col-span-1 md:col-span-2 space-y-2">

                  <label className="text-[10px] font-bold uppercase tracking-widest">
                    Description
                  </label>

                  <Field
                    name="description"
                    as="textarea"
                    rows={5}
                    className="w-full p-4 text-sm border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-black rounded-lg transition-all resize-none"
                  />

                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-[10px] uppercase font-bold"
                  />

                </div>

              </div>
            </div>

            {/* =================================================
                PRICING
            ================================================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">

                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">
                  Pricing
                </h3>

                <div className="grid grid-cols-2 gap-4">

                  <div className="space-y-2">

                    <label className="text-[10px] font-bold uppercase tracking-widest">
                      Base Price (PKR)
                    </label>

                    <Field
                      name="price"
                      type="number"
                      min="0"
                      className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
                    />

                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red-500 text-[10px] uppercase font-bold"
                    />

                  </div>

                  <div className="space-y-2">

                    <label className="text-[10px] font-bold uppercase tracking-widest">
                      Sale Price
                    </label>

                    <Field
                      name="salePrice"
                      type="number"
                      min="0"
                      className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
                    />

                    <ErrorMessage
                      name="salePrice"
                      component="div"
                      className="text-red-500 text-[10px] uppercase font-bold"
                    />

                  </div>

                </div>
              </div>

              {/* STOCK */}

              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">

                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">
                  Inventory
                </h3>

                {variants.length > 0 ? (
                  <div className="p-4 rounded-lg bg-gray-50">

                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Total Variant Stock
                    </p>

                    <p className="text-3xl font-semibold mt-2">
                      {calculateVariantStock()}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Calculated automatically
                      from size stock.
                    </p>

                  </div>
                ) : (
                  <div className="space-y-2">

                    <label className="text-[10px] font-bold uppercase tracking-widest">
                      Stock Quantity
                    </label>

                    <Field
                      name="stock"
                      type="number"
                      min="0"
                      className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
                    />

                    <ErrorMessage
                      name="stock"
                      component="div"
                      className="text-red-500 text-[10px] uppercase font-bold"
                    />

                  </div>
                )}

              </div>

            </div>

            {/* =================================================
                MAIN PRODUCT IMAGES
            ================================================= */}

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                    Product Media
                  </h3>

                  <p className="text-xs text-gray-400 mt-2">
                    Optional general product
                    images.
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

                {images.map(
                  (img, index) => (
                    <div
                      key={`${img.publicId}-${index}`}
                      className="relative aspect-[3/4] bg-gray-50 border border-gray-100 rounded-lg overflow-hidden group"
                    >

                      <img
                        src={img.url}
                        alt={`Product image ${
                          index + 1
                        }`}
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveImage(
                            index
                          )
                        }
                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      >
                        <X className="w-3 h-3" />
                      </button>

                    </div>
                  )
                )}

                <label className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all cursor-pointer">

                  {uploadingVariantId ===
                  "main" ? (
                    <Loader2 className="w-6 h-6 mb-2 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6 mb-2" />
                  )}

                  <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">
                    {uploadingVariantId ===
                    "main"
                      ? "Uploading..."
                      : "Upload Image"}
                  </span>

                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    disabled={
                      uploadingVariantId !==
                      null
                    }
                    onChange={
                      handleImageUpload
                    }
                  />

                </label>

              </div>
            </div>

            {/* =================================================
                VARIANTS
            ================================================= */}

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-8">

              {/* HEADER */}

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 pb-5">

                <div>

                  <h3 className="text-sm font-bold uppercase tracking-widest">
                    Product Variants
                  </h3>

                  <p className="text-xs text-gray-400 mt-2">
                    Add colors, images and
                    size-specific stock.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center justify-center gap-2 bg-black text-white px-5 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />

                  Add Color
                </button>

              </div>

              {/* EMPTY */}

              {variants.length === 0 && (
                <div className="border-2 border-dashed border-gray-100 rounded-xl p-12 text-center">

                  <div className="w-12 h-12 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">

                    <Plus className="w-5 h-5 text-gray-400" />

                  </div>

                  <p className="text-sm font-medium">
                    No variants added
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Add a color to start
                    creating product variants.
                  </p>

                  <button
                    type="button"
                    onClick={addVariant}
                    className="mt-5 px-5 py-3 bg-black text-white rounded-lg text-[10px] font-bold uppercase tracking-widest"
                  >
                    Add First Color
                  </button>

                </div>
              )}

              {/* VARIANTS */}

              <div className="space-y-8">

                {variants.map(
                  (variant, variantIndex) => (
                    <div
                      key={variant.id}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >

                      {/* VARIANT HEADER */}

                      <div className="p-6 bg-gray-50 border-b border-gray-200">

                        <div className="flex items-center justify-between gap-4">

                          <div className="flex items-center gap-3">

                            <div
                              className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
                              style={{
                                backgroundColor:
                                  variant.colorHex ||
                                  "#000000",
                              }}
                            />

                            <div>

                              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                                Variant{" "}
                                {variantIndex +
                                  1}
                              </p>

                              <p className="text-sm font-semibold">
                                {variant.colorName ||
                                  "New Color"}
                              </p>

                            </div>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeVariant(
                                variant.id
                              )
                            }
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove color"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                        {/* COLOR INPUTS */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                          <div className="space-y-2">

                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                              Color Name
                            </label>

                            <input
                              type="text"
                              value={
                                variant.colorName
                              }
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "colorName",
                                  e.target.value
                                )
                              }
                              placeholder="e.g. Red"
                              className="w-full p-4 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:border-black"
                            />

                          </div>

                          <div className="space-y-2">

                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                              Color
                            </label>

                            <div className="flex gap-3">

                              <input
                                type="color"
                                value={
                                  variant.colorHex ||
                                  "#000000"
                                }
                                onChange={(e) =>
                                  updateVariant(
                                    variant.id,
                                    "colorHex",
                                    e.target.value
                                  )
                                }
                                className="w-14 h-14 rounded-lg border border-gray-200 cursor-pointer p-1 bg-white"
                              />

                              <input
                                type="text"
                                value={
                                  variant.colorHex
                                }
                                onChange={(e) =>
                                  updateVariant(
                                    variant.id,
                                    "colorHex",
                                    e.target.value
                                  )
                                }
                                placeholder="#000000"
                                className="flex-1 p-4 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:border-black uppercase"
                              />

                            </div>

                          </div>

                        </div>

                      </div>

                      {/* VARIANT BODY */}

                      <div className="p-6 space-y-8">

                        {/* =================================
                            COLOR IMAGES
                        ================================= */}

                        <div>

                          <div className="flex items-center justify-between mb-4">

                            <div>

                              <h4 className="text-xs font-bold uppercase tracking-widest">
                                {variant.colorName ||
                                  "Color"}{" "}
                                Images
                              </h4>

                              <p className="text-xs text-gray-400 mt-1">
                                These images belong
                                specifically to this
                                color.
                              </p>

                            </div>

                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

                            {variant.images.map(
                              (
                                image,
                                imageIndex
                              ) => (
                                <div
                                  key={`${image.publicId}-${imageIndex}`}
                                  className="relative aspect-[3/4] rounded-lg overflow-hidden border border-gray-100 group bg-gray-50"
                                >

                                  <img
                                    src={
                                      image.url
                                    }
                                    alt={`${variant.colorName} image ${
                                      imageIndex +
                                      1
                                    }`}
                                    className="w-full h-full object-cover"
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveVariantImage(
                                        variant.id,
                                        imageIndex
                                      )
                                    }
                                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>

                                  {imageIndex ===
                                    0 && (
                                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black text-white text-[8px] uppercase tracking-widest font-bold">
                                      Main
                                    </div>
                                  )}

                                </div>
                              )
                            )}

                            <label className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all cursor-pointer">

                              {uploadingVariantId ===
                              variant.id ? (
                                <Loader2 className="w-6 h-6 mb-2 animate-spin" />
                              ) : (
                                <ImagePlus className="w-6 h-6 mb-2" />
                              )}

                              <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">
                                {uploadingVariantId ===
                                variant.id
                                  ? "Uploading..."
                                  : "Add Image"}
                              </span>

                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                disabled={
                                  uploadingVariantId !==
                                  null
                                }
                                onChange={(e) =>
                                  handleVariantImageUpload(
                                    e,
                                    variant.id
                                  )
                                }
                              />

                            </label>

                          </div>

                        </div>

                        {/* =================================
                            SIZES + STOCK
                        ================================= */}

                        <div>

                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">

                            <div>

                              <h4 className="text-xs font-bold uppercase tracking-widest">
                                Sizes & Stock
                              </h4>

                              <p className="text-xs text-gray-400 mt-1">
                                Set inventory for each
                                size of{" "}
                                <strong>
                                  {variant.colorName ||
                                    "this color"}
                                </strong>
                                .
                              </p>

                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                addSize(
                                  variant.id
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:border-black transition-colors"
                            >
                              <Plus className="w-3 h-3" />

                              Add Size
                            </button>

                          </div>

                          {variant.sizes.length ===
                          0 ? (
                            <div className="border border-dashed border-gray-200 rounded-lg p-8 text-center">

                              <p className="text-xs text-gray-400">
                                No sizes added for
                                this color.
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  addSize(
                                    variant.id
                                  )
                                }
                                className="mt-3 text-[10px] font-bold uppercase tracking-widest underline"
                              >
                                Add Size
                              </button>

                            </div>
                          ) : (
                            <div className="border border-gray-200 rounded-lg overflow-hidden">

                              {/* TABLE HEADER */}

                              <div className="grid grid-cols-[1fr_1fr_48px] bg-gray-50 border-b border-gray-200">

                                <div className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                                  Size
                                </div>

                                <div className="px-4 py-3 text-[9px] font-bold uppercase tracking-widest text-gray-400">
                                  Stock
                                </div>

                                <div />

                              </div>

                              {/* TABLE ROWS */}

                              {variant.sizes.map(
                                (
                                  size
                                ) => (
                                  <div
                                    key={
                                      size.id
                                    }
                                    className="grid grid-cols-[1fr_1fr_48px] border-b border-gray-100 last:border-b-0"
                                  >

                                    <div className="p-3">

                                      <input
                                        type="text"
                                        value={
                                          size.size
                                        }
                                        onChange={(
                                          e
                                        ) =>
                                          updateSize(
                                            variant.id,
                                            size.id,
                                            "size",
                                            e
                                              .target
                                              .value
                                          )
                                        }
                                        placeholder="S / M / L / XL"
                                        className="w-full px-3 py-3 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:bg-white focus:outline-none focus:border-black"
                                      />

                                    </div>

                                    <div className="p-3">

                                      <input
                                        type="number"
                                        min="0"
                                        value={
                                          size.stock
                                        }
                                        onChange={(
                                          e
                                        ) =>
                                          updateSize(
                                            variant.id,
                                            size.id,
                                            "stock",
                                            e
                                              .target
                                              .value
                                          )
                                        }
                                        className="w-full px-3 py-3 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:bg-white focus:outline-none focus:border-black"
                                      />

                                    </div>

                                    <div className="flex items-center justify-center">

                                      <button
                                        type="button"
                                        onClick={() =>
                                          removeSize(
                                            variant.id,
                                            size.id
                                          )
                                        }
                                        className="p-2 text-gray-400 hover:text-red-500"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>

                                    </div>

                                  </div>
                                )
                              )}

                            </div>
                          )}

                          {/* VARIANT TOTAL */}

                          <div className="mt-3 flex justify-end">

                            <p className="text-[10px] uppercase tracking-widest text-gray-400">
                              Color Total:{" "}
                              <strong className="text-black">
                                {variant.sizes.reduce(
                                  (
                                    total,
                                    size
                                  ) =>
                                    total +
                                    Number(
                                      size.stock ||
                                        0
                                    ),
                                  0
                                )}
                              </strong>
                            </p>

                          </div>

                        </div>

                      </div>
                    </div>
                  )
                )}

              </div>
            </div>

            {/* =================================================
                CLASSIFICATION
            ================================================= */}

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">

              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">
                Classification
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* CATEGORY */}

                <div className="space-y-2">

                  <label className="text-[10px] font-bold uppercase tracking-widest">
                    Category
                  </label>

                  <Field
                    name="categoryId"
                    as="select"
                    className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black appearance-none"
                  >

                    <option value="">
                      Select Category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={
                            category.id ||
                            category._id
                          }
                          value={
                            category.id ||
                            category._id
                          }
                        >
                          {category.name}
                        </option>
                      )
                    )}

                  </Field>

                  <ErrorMessage
                    name="categoryId"
                    component="div"
                    className="text-red-500 text-[10px] uppercase font-bold"
                  />

                </div>

                {/* FLAGS */}

                <div className="flex flex-wrap gap-6 pt-6">

                  <label className="flex items-center gap-3 cursor-pointer">

                    <Field
                      type="checkbox"
                      name="isFeatured"
                    />

                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Featured
                    </span>

                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">

                    <Field
                      type="checkbox"
                      name="isNewArrival"
                    />

                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      New Arrival
                    </span>

                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">

                    <Field
                      type="checkbox"
                      name="isBestSeller"
                    />

                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Best Seller
                    </span>

                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">

                    <Field
                      type="checkbox"
                      name="isFlashSale"
                    />

                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Flash Sale
                    </span>

                  </label>

                </div>

              </div>
            </div>

            {/* =================================================
                ATTRIBUTES
            ================================================= */}

            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">

              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">
                Attributes
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2">

                  <label className="text-[10px] font-bold uppercase tracking-widest">
                    Material
                  </label>

                  <Field
                    name="material"
                    className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
                  />

                </div>

                <div className="space-y-2">

                  <label className="text-[10px] font-bold uppercase tracking-widest">
                    Care Instructions
                  </label>

                  <Field
                    name="careInstructions"
                    className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
                  />

                </div>

              </div>
            </div>

            {/* =================================================
                SAVE
            ================================================= */}

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-50">

              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  uploadingVariantId !==
                    null
                }
                className="bg-black text-white px-12 py-5 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >

                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}

                <span className="text-sm font-bold uppercase tracking-widest">
                  {isSubmitting
                    ? "Saving..."
                    : "Save Product"}
                </span>

              </button>

            </div>

          </Form>
        )}
      </Formik>
    </div>
  );
}