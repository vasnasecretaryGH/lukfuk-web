"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProducts, Product } from "@/lib/supabase/db";

const categories = ["house", "scratcher", "combo"];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    getProducts().then((p) => { setProducts(p); setLoading(false); });
  }, []);

  const toggleCategory = (cat: string) =>
    setSelected((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);

  const filtered = products
    .filter((p) => selected.length === 0 || selected.includes(p.category))
    .filter((p) => !inStockOnly || p.stock > 0)
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <>
      <Navbar />

      <div className="bg-mint/40 px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs text-charcoal/40 mb-1">Home / Shop</p>
          <h1 className="font-display text-4xl font-bold text-charcoal">Shop All</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex gap-10">
        {/* Sidebar */}
        <aside className="hidden md:block w-52 shrink-0 space-y-8">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm text-charcoal flex items-center gap-1.5">
              <SlidersHorizontal size={14} /> Filter
            </p>
            {selected.length > 0 && (
              <button onClick={() => setSelected([])} className="text-xs text-sage hover:text-sage-dark transition-colors">Clear All</button>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal/40 mb-3">Categories</p>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={selected.includes(cat)} onChange={() => toggleCategory(cat)} className="w-4 h-4 accent-sage rounded" />
                    <span className="text-sm text-charcoal/70 capitalize group-hover:text-charcoal transition-colors">
                      {cat === "combo" ? "2-in-1 Combo" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal/40 mb-3">Availability</p>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={inStockOnly} onChange={() => setInStockOnly((v) => !v)} className="w-4 h-4 accent-sage rounded" />
              <span className="text-sm text-charcoal/70 group-hover:text-charcoal transition-colors">In Stock only</span>
            </label>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <p className="text-sm text-charcoal/50">{filtered.length} products</p>
            <div className="relative">
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-cream border border-sage/30 text-sm text-charcoal rounded-full px-4 py-2 pr-8 focus:outline-none focus:border-sage cursor-pointer">
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 pointer-events-none" />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-mint/40 rounded-3xl aspect-square mb-3" />
                  <div className="h-3 bg-charcoal/10 rounded-full w-3/4 mb-2" />
                  <div className="h-3 bg-charcoal/10 rounded-full w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <Link key={p.id} href={`/shop/${p.id}`} className="group block">
                  <div className={`${p.stock === 0 ? "opacity-50" : ""} bg-mint/40 rounded-3xl aspect-square flex items-center justify-center mb-3 relative overflow-hidden transition-all duration-300 group-hover:scale-[1.02]`}>
                    {p.badge && (
                      <span className="absolute top-3 left-3 bg-charcoal text-cream text-[10px] font-semibold px-2.5 py-1 rounded-full">{p.badge}</span>
                    )}
                    {p.stock === 0 && (
                      <span className="absolute top-3 right-3 bg-blush text-charcoal/60 text-[10px] font-semibold px-2.5 py-1 rounded-full">Out of Stock</span>
                    )}
                    {p.images[0] ? (
                      <img src={p.images[0]} alt={p.name_en} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-5xl">🐾</span>
                    )}
                  </div>
                  <p className="font-body font-medium text-charcoal text-sm leading-snug">{p.name_en}</p>
                  <p className="text-sage font-semibold text-sm mt-0.5">฿{p.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
