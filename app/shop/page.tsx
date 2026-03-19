"use client";

import { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const allProducts = [
  { id: 1, name: "The Serene Sanctuary", price: 1290, category: "house", badge: null, stock: true, bg: "bg-mint" },
  { id: 2, name: "Cloud 9 Scratcher Lounge", price: 890, category: "scratcher", badge: "Best Seller", stock: true, bg: "bg-blush" },
  { id: 3, name: "Vertical Forest Climber", price: 2490, category: "combo", badge: "New", stock: true, bg: "bg-mint" },
  { id: 4, name: "Felted Cocoon Nest", price: 1490, category: "house", badge: null, stock: true, bg: "bg-blush" },
  { id: 5, name: "The Ripple Wave Scratcher", price: 750, category: "scratcher", badge: "New", stock: false, bg: "bg-mint" },
  { id: 6, name: "Zen Ceramic Feeder Set", price: 1290, category: "combo", badge: null, stock: true, bg: "bg-blush" },
];

const categories = ["house", "scratcher", "combo"];

export default function ShopPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("newest");

  const toggleCategory = (cat: string) =>
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const filtered = allProducts
    .filter((p) => selected.length === 0 || selected.includes(p.category))
    .filter((p) => !inStockOnly || p.stock)
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <>
      <Navbar />

      {/* Page header */}
      <div className="bg-mint/40 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-charcoal/40 mb-1">Home / Shop</p>
          <h1 className="font-display text-4xl font-bold text-charcoal">Shop All</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-10">
        {/* ── SIDEBAR FILTERS ── */}
        <aside className="hidden md:block w-52 shrink-0 space-y-8">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm text-charcoal flex items-center gap-1.5">
              <SlidersHorizontal size={14} /> Filter
            </p>
            {selected.length > 0 && (
              <button
                onClick={() => setSelected([])}
                className="text-xs text-sage hover:text-sage-dark transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal/40 mb-3">
              Categories
            </p>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selected.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-4 h-4 accent-sage rounded"
                    />
                    <span className="text-sm text-charcoal/70 capitalize group-hover:text-charcoal transition-colors">
                      {cat === "combo" ? "2-in-1 Combo" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* In Stock */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal/40 mb-3">
              Availability
            </p>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={() => setInStockOnly((v) => !v)}
                className="w-4 h-4 accent-sage rounded"
              />
              <span className="text-sm text-charcoal/70 group-hover:text-charcoal transition-colors">
                In Stock only
              </span>
            </label>
          </div>
        </aside>

        {/* ── PRODUCT GRID ── */}
        <div className="flex-1">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-charcoal/50">
              {filtered.length} products
            </p>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-cream border border-sage/30 text-sm text-charcoal rounded-full px-4 py-2 pr-8 focus:outline-none focus:border-sage cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <Link key={p.id} href={`/shop/${p.id}`} className="group block">
                <div
                  className={`${p.bg} ${!p.stock ? "opacity-50" : ""} rounded-3xl aspect-square flex items-center justify-center mb-3 relative overflow-hidden transition-all duration-300 group-hover:scale-[1.02]`}
                >
                  {p.badge && (
                    <span className="absolute top-3 left-3 bg-charcoal text-cream text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      {p.badge}
                    </span>
                  )}
                  {!p.stock && (
                    <span className="absolute top-3 right-3 bg-blush text-charcoal/60 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      Out of Stock
                    </span>
                  )}
                  <span className="text-5xl">🐾</span>
                </div>
                <p className="font-body font-medium text-charcoal text-sm leading-snug">
                  {p.name}
                </p>
                <p className="text-sage font-semibold text-sm mt-0.5">
                  ฿{p.price.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-12">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${n === 1 ? "bg-charcoal text-cream" : "text-charcoal/50 hover:bg-mint"}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
