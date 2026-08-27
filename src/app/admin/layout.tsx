"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  X
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMobileMenuOpen as setIsSidebarOpen } from "@/store/slices/uiSlice";
import { performLogout } from "@/store/slices/authSlice";
import { cn } from "@/lib/utils";

const SIDEBAR_LINKS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Tag },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Coupons", href: "/admin/coupons", icon: Tag },
  { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { name: "Banners", href: "/admin/banners", icon: ImageIcon },
  { name: "Blog", href: "/admin/blog", icon: BookOpen },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isMobileMenuOpen: isSidebarOpen } = useAppSelector((state) => state.ui);
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const logout = () => {
    dispatch(performLogout());
  };

  // If user is not admin, we might want to handle it here or in middleware
  // For now, let's assume middleware handles it, but as a safety:
  if (user && user.role !== 'admin' && pathname !== '/admin/login') {
    // router.push('/');
    // return null;
  }

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <Link href="/admin" className="text-xl font-bold tracking-tighter uppercase">
              Admin Panel
            </Link>
            <button className="lg:hidden" onClick={() => dispatch(setIsSidebarOpen(false))}>
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {SIDEBAR_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-black text-white" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-black"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={() => logout()}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <button className="lg:hidden" onClick={() => dispatch(setIsSidebarOpen(true))}>
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{user?.name || "Admin"}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
