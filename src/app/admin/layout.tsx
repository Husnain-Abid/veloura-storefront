"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  MessageSquare,
  Settings,
  LogOut,
  Image as ImageIcon,
  BookOpen,
  Menu,
  X,
  UserCircle,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { performLogout } from "@/store/slices/authSlice";
import { cn } from "@/lib/utils";

const SIDEBAR_LINKS = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Tag,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Coupons",
    href: "/admin/coupons",
    icon: Tag,
  },
  {
    name: "Reviews",
    href: "/admin/reviews",
    icon: MessageSquare,
  },
  {
    name: "Banners",
    href: "/admin/banners",
    icon: ImageIcon,
  },
  {
    name: "Blog",
    href: "/admin/blog",
    icon: BookOpen,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();

  const { user } = useAppSelector((state) => state.auth);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ---------------------------------------------------------------------- */
  /* Admin login page should NOT show sidebar/header                        */
  /* ---------------------------------------------------------------------- */

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  /* ---------------------------------------------------------------------- */
  /* Logout                                                                */
  /* ---------------------------------------------------------------------- */

  const handleLogout = async () => {
    await dispatch(performLogout());

    setSidebarOpen(false);

    router.push("/admin/login");
  };

  /* ---------------------------------------------------------------------- */
  /* Active link                                                           */
  /* ---------------------------------------------------------------------- */

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================================================================== */}
      {/* Mobile overlay                                                     */}
      {/* ================================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================================================================== */}
      {/* Sidebar                                                             */}
      {/* ================================================================== */}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300",
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}

        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-5">
          <Link
            href="/admin"
            className="text-lg font-bold uppercase tracking-tight"
          >
            ELEGANCE
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Admin label */}

        <div className="px-5 pb-2 pt-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Administration
          </p>
        </div>

        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <div className="space-y-1">
            {SIDEBAR_LINKS.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-black"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar bottom user */}

        <div className="shrink-0 border-t border-gray-200 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
              <UserCircle className="h-5 w-5 text-gray-500" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {user?.name || "Admin"}
              </p>

              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {user?.role || "Administrator"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* ================================================================== */}
      {/* Main                                                               */}
      {/* ================================================================== */}

      <div className="min-h-screen lg:pl-64">
        {/* ================================================================ */}
        {/* Top Header                                                        */}
        {/* ================================================================ */}

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur-md lg:px-8">
          {/* Mobile menu button */}

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 lg:hidden"
            aria-label="Open admin menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page title */}

          <div className="hidden lg:block">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
              Admin Panel
            </p>
          </div>

          {/* Right side */}

          <div className="ml-auto flex items-center gap-3">
            {/* User */}

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">
                {user?.name || "Admin"}
              </p>

              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {user?.role || "Administrator"}
              </p>
            </div>

            {/* Avatar */}

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
              {(user?.name?.charAt(0) || "A").toUpperCase()}
            </div>

            {/* Logout */}

            <button
              type="button"
              onClick={handleLogout}
              className="hidden h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-xs font-bold uppercase tracking-wider text-gray-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:flex"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        {/* ================================================================ */}
        {/* Content                                                           */}
        {/* ================================================================ */}

        <main className="min-h-[calc(100vh-4rem)] overflow-x-hidden p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
