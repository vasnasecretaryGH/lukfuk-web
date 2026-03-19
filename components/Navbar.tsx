"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, Globe, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/supabase/auth";
import { useCartStore } from "@/lib/stores/cartStore";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Our Story", href: "/our-story" },
  { label: "Find a Store", href: "/find-a-store" },
];

export default function Navbar() {
  const [lang, setLang] = useState<"TH" | "EN">("EN");
  const { user, profile } = useAuth();
  const itemCount = useCartStore((s) => s.itemCount());
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-cream/80 border-b border-sage/20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl font-semibold text-charcoal tracking-tight"
        >
          Lukfuk.BKK
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-body text-charcoal/70 hover:text-charcoal transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === "EN" ? "TH" : "EN")}
            className="flex items-center gap-1 text-xs text-charcoal/60 hover:text-charcoal transition-colors"
            aria-label="Toggle language"
          >
            <Globe size={14} />
            <span>{lang}</span>
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative text-charcoal/70 hover:text-charcoal transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-sage text-white text-[10px] flex items-center justify-center font-medium">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Profile / Auth */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/account"
                className="flex items-center gap-1.5 text-xs font-medium text-charcoal/70 hover:text-charcoal transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-mint flex items-center justify-center text-[10px] font-bold text-charcoal/70">
                  {(profile?.display_name ?? user.email ?? "U")[0].toUpperCase()}
                </div>
                <span className="hidden md:inline">{profile?.display_name ?? "Account"}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-charcoal/40 hover:text-charcoal transition-colors"
                aria-label="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 text-charcoal/70 hover:text-charcoal transition-colors"
              aria-label="Sign in"
            >
              <User size={20} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
