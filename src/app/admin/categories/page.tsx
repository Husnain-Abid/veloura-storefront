"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Tag, Loader2 } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsFilterOpen] = useState(false); // Simplified

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Organize your products into logical groups.</p>
        </div>
        <button className="bg-black text-white px-6 py-4 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Slug</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Description</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-full" /></td>
                  </tr>
                ))
              ) : categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold uppercase text-sm">{cat.name}</td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-400">{cat.slug}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 line-clamp-1 max-w-xs">{cat.description}</td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded transition-colors"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                        <button className="p-2 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4 text-red-600" /></button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
