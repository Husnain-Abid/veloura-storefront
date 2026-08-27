"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Filter,
  Check,
  X,
  Package,
  Loader2
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts, deleteProduct } from "@/store/slices/productSlice";

export default function AdminProducts() {
  const dispatch = useAppDispatch();
  const { items: products, loading } = useAppSelector((state) => state.product);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchProducts("?limit=100"));
  }, [dispatch]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product? This will remove it from all active carts but historical orders will be preserved.")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your inventory, prices, and product visibility.</p>
        </div>
        <Link 
          href="/admin/products/new"
          className="bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-4 flex items-center gap-2 hover:bg-gray-800 transition-colors rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 focus:outline-none focus:border-black rounded-lg"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-lg text-sm font-medium hover:border-black transition-colors bg-white">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Stock</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date Added</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading && products.length === 0 ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-12 w-12 bg-gray-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-12 bg-gray-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100 rounded" /></td>
                    <td className="px-6 py-4"><div className="h-8 w-8 bg-gray-100 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-gray-100 shrink-0 rounded overflow-hidden">
                        <img src={product.images[0]?.url} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase line-clamp-1">{product.name}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{product.categoryId ? "Assigned" : "No Category"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{formatPrice(product.price)}</span>
                      {product.salePrice && <span className="text-[10px] text-red-500 line-through">{formatPrice(product.salePrice)}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-sm font-medium",
                      product.stock < 10 ? "text-red-500 font-bold" : "text-gray-600"
                    )}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      product.stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>
                      {product.stock > 0 ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {product.stock > 0 ? "Active" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${product.id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group/del"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!loading && filteredProducts.length === 0 && (
          <div className="py-24 text-center">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-serif">No products found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
