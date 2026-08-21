"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Save,
  Trash2,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ProductEditor() {
  const router = useRouter();
  const { id } = useParams();
  const isEdit = id && id !== "new";
  
  const [loading, setLoading] = useState(isEdit ? true : false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    salePrice: "",
    stock: "0",
    categoryId: "",
    material: "",
    careInstructions: "",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [{ name: "Black", hex: "#000000" }],
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    isFlashSale: false,
  });

  const [images, setImages] = useState<{ url: string; publicId: string }[]>([]);

  useEffect(() => {
    // Fetch categories
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
        setFormData({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const url = isEdit ? `/api/admin/products/update` : `/api/admin/products/create`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, images, id: isEdit ? id : undefined }),
      });

      if (res.ok) {
        router.push("/admin/products");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save product");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

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

      <form onSubmit={handleSubmit} className="space-y-8 pb-24">
        {/* Basic Info */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest">Product Name</label>
              <input 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                className="w-full p-4 text-sm border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-black rounded-lg transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest">Slug (URL)</label>
              <input 
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full p-4 text-sm border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-black rounded-lg transition-all"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest">Description</label>
              <textarea 
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-4 text-sm border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:border-black rounded-lg transition-all resize-none"
              />
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
                <input 
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Sale Price (Optional)</label>
                <input 
                  type="number"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Inventory</h3>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest">Stock Quantity</label>
              <input 
                required
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Product Media</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-[3/4] bg-gray-50 border border-gray-100 rounded-lg overflow-hidden group">
                <img src={img.url} className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button 
              type="button"
              className="aspect-[3/4] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all"
              onClick={() => {
                const url = prompt("Enter image URL (for demo purposes):");
                if (url) setImages([...images, { url, publicId: "dummy" }]);
              }}
            >
              <Upload className="w-6 h-6 mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Upload Image</span>
            </button>
          </div>
        </div>

        {/* categorization */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Classification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Category</label>
                <select 
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full p-4 text-sm border border-gray-100 bg-gray-50 rounded-lg focus:outline-none focus:border-black appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
            </div>
            <div className="flex flex-wrap gap-6 pt-6">
               <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Featured</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.isNewArrival} onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">New Arrival</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={formData.isBestSeller} onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Best Seller</span>
               </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-50">
           <button 
            type="submit"
            disabled={saving}
            className="bg-black text-white px-12 py-5 rounded-full shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform disabled:opacity-50"
           >
             <Save className="w-5 h-5" />
             <span className="text-sm font-bold uppercase tracking-widest">{saving ? "Saving..." : "Save Product"}</span>
           </button>
        </div>
      </form>
    </div>
  );
}
