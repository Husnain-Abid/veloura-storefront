"use client";

import { useEffect, useState } from "react";
import {
Plus,
Edit2,
Trash2,
Loader2,
X,
Tag,
AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Category = {
id: string;
name: string;
slug: string;
description?: string;
};

type CategoryForm = {
name: string;
slug: string;
description: string;
};

const emptyForm: CategoryForm = {
name: "",
slug: "",
description: "",
};

export default function AdminCategories() {
const [categories, setCategories] = useState<Category[]>([]);
const [loading, setLoading] = useState(true);

const [modalOpen, setModalOpen] = useState(false);
const [deleteModalOpen, setDeleteModalOpen] = useState(false);

const [editingCategory, setEditingCategory] =
useState<Category | null>(null);

const [categoryToDelete, setCategoryToDelete] =
useState<Category | null>(null);

const [form, setForm] = useState<CategoryForm>(emptyForm);

const [saving, setSaving] = useState(false);
const [deleting, setDeleting] = useState(false);

/* ---------------------------------------------------------------------- */
/* Fetch Categories                                                       */
/* ---------------------------------------------------------------------- */

const fetchCategories = async () => {
try {
setLoading(true);

  const res = await fetch("/api/categories", {
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        "Failed to load categories."
    );
  }

  // Support both:
  // [categories]
  // { categories: [...] }
  const list = Array.isArray(data)
    ? data
    : data.categories || [];

  setCategories(list);
} catch (error: any) {
  console.error("Fetch categories error:", error);

  toast.error(
    error?.message ||
      "Failed to load categories."
  );
} finally {
  setLoading(false);
}

};

useEffect(() => {
fetchCategories();
}, []);

/* ---------------------------------------------------------------------- */
/* Slug Generator                                                         */
/* ---------------------------------------------------------------------- */

const generateSlug = (name: string) => {
return name
.toLowerCase()
.trim()
.replace(/[^a-z0-9\s-]/g, "")
.replace(/\s+/g, "-")
.replace(/-+/g, "-");
};

/* ---------------------------------------------------------------------- */
/* Open Add Modal                                                         */
/* ---------------------------------------------------------------------- */

const openAddModal = () => {
setEditingCategory(null);
setForm(emptyForm);
setModalOpen(true);
};

/* ---------------------------------------------------------------------- */
/* Open Edit Modal                                                        */
/* ---------------------------------------------------------------------- */

const openEditModal = (category: Category) => {
setEditingCategory(category);

setForm({
  name: category.name || "",
  slug: category.slug || "",
  description: category.description || "",
});

setModalOpen(true);

};

/* ---------------------------------------------------------------------- */
/* Close Modal                                                            */
/* ---------------------------------------------------------------------- */

const closeModal = () => {
if (saving) return;

setModalOpen(false);
setEditingCategory(null);
setForm(emptyForm);

};

/* ---------------------------------------------------------------------- */
/* Form Change                                                            */
/* ---------------------------------------------------------------------- */

const handleNameChange = (
value: string
) => {
setForm((current) => ({
...current,
name: value,


  // Automatically generate slug only
  // when creating a category.
  slug: editingCategory
    ? current.slug
    : generateSlug(value),
}));

};

/* ---------------------------------------------------------------------- */
/* Save Category                                                          */
/* ---------------------------------------------------------------------- */

const handleSubmit = async (
e: React.FormEvent
) => {
e.preventDefault();

const name = form.name.trim();
const slug = form.slug.trim();

if (!name) {
  toast.error("Category name is required.");
  return;
}

if (!slug) {
  toast.error("Category slug is required.");
  return;
}

setSaving(true);

const toastId = toast.loading(
  editingCategory
    ? "Updating category..."
    : "Creating category..."
);

try {
  const url = editingCategory
    ? `/api/categories/${editingCategory.id}`
    : "/api/categories";

  const method = editingCategory
    ? "PUT"
    : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      slug,
      description: form.description.trim(),
    }),
  });

  let data: any = {};

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    let message =
      data?.message ||
      data?.error ||
      "Failed to save category.";

    if (
      data?.error === "DUPLICATE_NAME"
    ) {
      message =
        data.message ||
        "A category with this name already exists.";
    }

    if (
      data?.error === "DUPLICATE_SLUG"
    ) {
      message =
        data.message ||
        "A category with this slug already exists.";
    }

    toast.error(message, {
      id: toastId,
      duration: 5000,
    });

    return;
  }

  toast.success(
    data?.message ||
      (editingCategory
        ? "Category updated successfully."
        : "Category created successfully."),
    {
      id: toastId,
    }
  );

  setModalOpen(false);
  setEditingCategory(null);
  setForm(emptyForm);

  await fetchCategories();
} catch (error) {
  console.error(
    "Save category error:",
    error
  );

  toast.error(
    "Unable to connect to the server. Please try again.",
    {
      id: toastId,
      duration: 5000,
    }
  );
} finally {
  setSaving(false);
}

};

/* ---------------------------------------------------------------------- */
/* Open Delete Modal                                                      */
/* ---------------------------------------------------------------------- */

const openDeleteModal = (
category: Category
) => {
setCategoryToDelete(category);
setDeleteModalOpen(true);
};

/* ---------------------------------------------------------------------- */
/* Delete Category                                                        */
/* ---------------------------------------------------------------------- */

const handleDelete = async () => {
if (!categoryToDelete) return;


setDeleting(true);

const toastId = toast.loading(
  "Deleting category..."
);

try {
  const res = await fetch(
    `/api/categories/${categoryToDelete.id}`,
    {
      method: "DELETE",
    }
  );

  let data: any = {};

  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    toast.error(
      data?.message ||
        data?.error ||
        "Failed to delete category.",
      {
        id: toastId,
        duration: 5000,
      }
    );

    return;
  }

  toast.success(
    data?.message ||
      "Category deleted successfully.",
    {
      id: toastId,
    }
  );

  setDeleteModalOpen(false);
  setCategoryToDelete(null);

  setCategories((current) =>
    current.filter(
      (category) =>
        category.id !==
        categoryToDelete.id
    )
  );
} catch (error) {
  console.error(
    "Delete category error:",
    error
  );

  toast.error(
    "Unable to connect to the server. Please try again.",
    {
      id: toastId,
    }
  );
} finally {
  setDeleting(false);
}

};

/* ---------------------------------------------------------------------- */
/* Render                                                                 */
/* ---------------------------------------------------------------------- */

return ( <div className="space-y-8">
{/* ------------------------------------------------------------------ */}
{/* Page Header                                                        */}
{/* ------------------------------------------------------------------ */}

  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
          <Tag className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-3xl font-serif">
            Categories
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Organize your products into logical groups.
          </p>
        </div>
      </div>
    </div>

    <button
      type="button"
      onClick={openAddModal}
      className="flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-4 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800"
    >
      <Plus className="h-4 w-4" />
      Add Category
    </button>
  </div>

  {/* ------------------------------------------------------------------ */}
  {/* Category Count                                                      */}
  {/* ------------------------------------------------------------------ */}

  <div className="rounded-xl border border-gray-100 bg-white px-6 py-4 shadow-sm">
    <div className="flex items-center justify-between">
      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
        Total Categories
      </span>

      <span className="text-xl font-bold">
        {categories.length}
      </span>
    </div>
  </div>

  {/* ------------------------------------------------------------------ */}
  {/* Categories Table                                                    */}
  {/* ------------------------------------------------------------------ */}

  <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Name
            </th>

            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Slug
            </th>

            <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Description
            </th>

            <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {/* Loading */}
          {loading &&
            [1, 2, 3].map((item) => (
              <tr
                key={item}
                className="animate-pulse"
              >
                <td
                  colSpan={4}
                  className="px-6 py-5"
                >
                  <div className="h-5 w-full rounded bg-gray-100" />
                </td>
              </tr>
            ))}

          {/* Empty */}
          {!loading &&
            categories.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-16 text-center"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                    <Tag className="h-6 w-6 text-gray-400" />
                  </div>

                  <h3 className="mt-4 font-serif text-xl">
                    No categories yet
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Create your first category to organize your products.
                  </p>

                  <button
                    type="button"
                    onClick={openAddModal}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-xs font-bold uppercase tracking-widest text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Add Category
                  </button>
                </td>
              </tr>
            )}

          {/* Categories */}
          {!loading &&
            categories.map((category) => (
              <tr
                key={category.id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="px-6 py-5">
                  <div className="font-bold uppercase text-sm">
                    {category.name}
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-500">
                    {category.slug}
                  </span>
                </td>

                <td className="max-w-md px-6 py-5">
                  <p className="truncate text-sm text-gray-500">
                    {category.description ||
                      "No description"}
                  </p>
                </td>

                <td className="px-6 py-5">
                  <div className="flex justify-end gap-2">
                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(category)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
                      aria-label={`Edit ${category.name}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() =>
                        openDeleteModal(category)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                      aria-label={`Delete ${category.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* ================================================================== */}
  {/* Add / Edit Modal                                                    */}
  {/* ================================================================== */}

  {modalOpen && (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div
        className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2 className="font-serif text-2xl">
              {editingCategory
                ? "Edit Category"
                : "Add Category"}
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              {editingCategory
                ? "Update category information."
                : "Create a new product category."}
            </p>
          </div>

          <button
            type="button"
            onClick={closeModal}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-black"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {/* Name */}
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Category Name
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                handleNameChange(
                  e.target.value
                )
              }
              placeholder="e.g. Western Wear"
              disabled={saving}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:bg-white"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Slug
            </label>

            <input
              type="text"
              value={form.slug}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  slug: e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "-"),
                }))
              }
              placeholder="western-wear"
              disabled={saving}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:bg-white"
            />

            <p className="mt-1 text-[10px] text-gray-400">
              Used in your category URL.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Description
            </label>

            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  description:
                    e.target.value,
                }))
              }
              placeholder="Describe this category..."
              rows={4}
              disabled={saving}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:bg-white"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="flex-1 rounded-lg border border-gray-200 px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {saving
                ? "Saving..."
                : editingCategory
                ? "Update Category"
                : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* ================================================================== */}
  {/* Delete Confirmation Modal                                           */}
  {/* ================================================================== */}

  {deleteModalOpen &&
    categoryToDelete && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
        <div
          className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="p-6">
            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>

            <h2 className="mt-5 font-serif text-2xl">
              Delete Category?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-bold text-black">
                "{categoryToDelete.name}"
              </span>
              ?
            </p>

            <p className="mt-2 text-xs text-gray-400">
              This action cannot be undone.
            </p>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setCategoryToDelete(null);
                }}
                disabled={deleting}
                className="flex-1 rounded-lg border border-gray-200 px-5 py-3 text-xs font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {deleting
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
</div>

);
}
