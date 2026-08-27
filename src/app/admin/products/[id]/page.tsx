"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Save,
  Plus,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ProductSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  slug: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  price: Yup.number().positive("Must be positive").required("Required"),
  salePrice: Yup.number().nullable().moreThan(0, "Must be positive"),
  stock: Yup.number().integer("Must be integer").min(0, "Cannot be negative").required("Required"),
  categoryId: Yup.string().required("Required"),
});

export default function ProductEditor() {
  const router = useRouter();
  const { id } = useParams();
  const isEdit = id && id !== "new";
  
  const [loading, setLoading] = useState(isEdit ? true : false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [initialValues, setInitialValues] = useState({
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

  const [images, setImages] = useState<{ url: string; publicId: string }[]>([]);

  useEffect(() => {
    const fetchCats = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    };
    fetchCats();

    if (isEdit) {
      const fetchProduct = async () => {
        const res = await fetch(`/api/products/details?id=${id}`);
        const product = await res.json();
        setInitialValues({
          ...product,
          price: product.price.toString(),
          salePrice: product.salePrice?.toString() || "",
          stock: product.stock.toString(),
        });
        setImages(product.images);
        setLoading(false);
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  if (loading) return <div className="p-24 text-center">Loading product data...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link 
          href="/admin/products"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
        <h1 className="text-2xl font-serif">{isEdit ? "Edit Product" : "Add New Product"}</h1>
      </div>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={ProductSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const url = isEdit ? `/api/admin/products/update` : `/api/admin/products/create`;
          const method = isEdit ? "PUT" : "POST";

          try {
            const res = await fetch(url, {
              method,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...values, images, id: isEdit ? id : undefined }),
            });

            if (res.ok) {
              router.push("/admin/products");
            } else {
              const err = await res.json();
              alert(err.error || "Failed to save product");
            }
          } catch (err) {
            alert("Something went wrong");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-8 pb-24">
            {/* Basic Info */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Product Name</label>
                  <Field 
                    name="name"
                    onChange={(e: any) => {
                      const val = e.target.value;
                      setFieldValue("name", val);
                      setFieldValue("slug", val.toLowerCase().replace(/ /g, '-'));
                    }}
                    className="w-full p-4 text-sm border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-black rounded-lg transition-all"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Slug (URL)</label>
                  <Field 
                    name="slug"
                    className="w-full p-4 text-sm border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-black rounded-lg transition-all"
                  />
                  <ErrorMessage name="slug" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Description</label>
                  <Field 
                    name="description"
                    as="textarea"
                    rows={5}
                    className="w-full p-4 text-sm border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-black rounded-lg transition-all resize-none"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                </div>
              </div>
            </div>

            {/* Inventory & Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Pricing</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest">Base Price (PKR)</label>
                    <Field 
                      name="price"
                      type="number"
                      className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
                    />
                    <ErrorMessage name="price" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest">Sale Price (Optional)</label>
                    <Field 
                      name="salePrice"
                      type="number"
                      className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
                    />
                    <ErrorMessage name="salePrice" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Inventory</h3>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Stock Quantity</label>
                  <Field 
                    name="stock"
                    type="number"
                    className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
                  />
                  <ErrorMessage name="stock" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Product Media</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-[3/4] bg-gray-50 border border-gray-100 rounded-lg overflow-hidden group">
                    <img src={img.url} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all cursor-pointer">
                  {uploading ? (
                    <Loader2 className="w-6 h-6 mb-2 animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6 mb-2" />
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-center px-4">
                    {uploading ? "Uploading..." : "Upload Image"}
                  </span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      setUploading(true);
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onloadend = async () => {
                        const base64data = reader.result;
                        const res = await fetch("/api/admin/upload", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ file: base64data }),
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setImages([...images, data]);
                        } else {
                          alert("Upload failed");
                        }
                        setUploading(false);
                      };
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Classification */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Classification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest">Category</label>
                    <Field 
                      name="categoryId"
                      as="select"
                      className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black appearance-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </Field>
                    <ErrorMessage name="categoryId" component="div" className="text-red-500 text-[10px] uppercase font-bold" />
                </div>
                <div className="flex flex-wrap gap-6 pt-6">
                   <label className="flex items-center gap-3 cursor-pointer">
                      <Field type="checkbox" name="isFeatured" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Featured</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer">
                      <Field type="checkbox" name="isNewArrival" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">New Arrival</span>
                   </label>
                   <label className="flex items-center gap-3 cursor-pointer">
                      <Field type="checkbox" name="isBestSeller" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Best Seller</span>
                   </label>
                </div>
              </div>
            </div>

            {/* Attributes */}
            <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Attributes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Material</label>
                  <Field name="material" className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest">Care Instructions</label>
                  <Field name="careInstructions" className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black" />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-50">
               <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-black text-white px-12 py-5 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50"
               >
                 {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                 <span className="text-sm font-bold uppercase tracking-widest">{isSubmitting ? "Saving..." : "Save Product"}</span>
               </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
