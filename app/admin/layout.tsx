"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  Users,
  MapPin,
  LogOut,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Inventory", href: "/admin/inventory", icon: Boxes },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Pet Shops", href: "/admin/stores", icon: MapPin },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-[#f7f6f1]">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-charcoal flex flex-col">
        <div className="px-6 py-6 border-b border-white/10">
          <p className="font-display text-lg font-semibold text-cream">Lukfuk.BKK</p>
          <p className="text-xs text-cream/30 mt-0.5">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-sage/20 text-sage"
                    : "text-cream/50 hover:bg-white/5 hover:text-cream"
                }`}
              >
                <Icon size={16} />
                {label}
                {active && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-sage/30 flex items-center justify-center text-xs font-bold text-sage">A</div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-cream truncate">Admin</p>
              <p className="text-[10px] text-cream/30">lukfuk.bkk</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cream/40 hover:text-cream hover:bg-white/5 transition-all"
          >
            <LogOut size={15} /> Sign out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
