"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Heart, ShoppingCart, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const relatedProducts = [
  { id: 2, name: "Page Cloud Nest", price: "฿890", bg: "bg-mint" },
  { id: 3, name: "Bamboo Cocoon Set", price: "฿650", bg: "bg-blush" },
  { id: 4, name: "Eko-mat Wall Hugs", price: "฿1,250", bg: "bg-mint" },
  { id: 5, name: "Artisan Grooming Kit", price: "฿990", bg: "bg-blush" },
];

const thumbnails = ["bg-mint", "bg-blush", "bg-mint/60", "bg-blush/60"];

export default function ProductDetailPage() {
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [open, setOpen] = useState<string | null>("details");

  const sections = [
    {
      key: "details",
      title: "Product Details",
      content:
        "Handcrafted from premium double-wall carton board. Each piece is individually cut, scored, and assembled by hand in Bangkok. Treated with food-safe sealant for durability.",
    },
    {
      key: "dimensions",
      title: "Dimensions & Materials",
      content:
        "W: 40cm × D: 40cm × H: 45cm. Weight: 1.2 kg. Material: Premium carton board (double-wall). Load capacity: up to 8kg.",
    },
    {
      key: "shipping",
      title: "Shipping Info",
      content:
        "Delivered via Flash Express or Shopee Express within Thailand. Estimated 2–5 business days. Free shipping on orders over ฿1,500.",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* ── IMAGE GALLERY ── */}
          <div className="space-y-4">
            <div className={`${thumbnails[activeThumb]} rounded-4xl aspect-square flex items-center justify-center relative overflow-hidden`}>
              <span className="absolute top-4 left-4 bg-charcoal text-cream text-xs font-semibold px-3 py-1 rounded-full">
                New Collection
              </span>
              <span className="text-9xl">🏠</span>
            </div>
            <div className="flex gap-3">
              {thumbnails.map((bg, i) => (
                <button
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className={`${bg} w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all ${activeThumb === i ? "ring-2 ring-charcoal ring-offset-2" : "opacity-60 hover:opacity-100"}`}
                >
                  🏠
                </button>
              ))}
            </div>
          </div>

          {/* ── PRODUCT INFO ── */}
          <div className="space-y-5">
            <p className="text-xs text-charcoal/40">Shop / House</p>

            <h1 className="font-display text-4xl font-bold text-charcoal leading-snug">
              Muji-Ka Ashwood House
            </h1>

            <p className="text-2xl font-semibold text-charcoal">฿4,200</p>

            <p className="text-charcoal/60 leading-relaxed text-sm">
              Rethink how furniture serves your feline. Made with our hand-rolled
              carton filament, you won&apos;t find another like it anywhere.
            </p>

            {/* Points preview */}
            <div className="inline-flex items-center gap-1.5 bg-gold/20 text-charcoal/70 text-xs font-medium px-3 py-1.5 rounded-full">
              <Star size={12} className="text-gold" fill="currentColor" />
              Earn 84 pts with this purchase
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-charcoal">Quantity</p>
              <div className="flex items-center gap-3 bg-mint/40 rounded-full px-4 py-2">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="text-charcoal/60 hover:text-charcoal text-lg leading-none"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-medium text-charcoal">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="text-charcoal/60 hover:text-charcoal text-lg leading-none"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 bg-charcoal text-cream py-4 rounded-full font-medium hover:bg-charcoal/80 transition-colors">
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button className="w-full flex items-center justify-center gap-2 border border-charcoal/20 text-charcoal py-3.5 rounded-full text-sm font-medium hover:bg-charcoal/5 transition-colors">
                <Heart size={16} /> Add to Wishlist
              </button>
            </div>

            {/* Collapsible sections */}
            <div className="border-t border-sage/20 pt-4 space-y-1">
              {sections.map((s) => (
                <div key={s.key} className="border-b border-sage/20">
                  <button
                    onClick={() => setOpen(open === s.key ? null : s.key)}
                    className="w-full flex items-center justify-between py-4 text-sm font-medium text-charcoal hover:text-charcoal/70 transition-colors"
                  >
                    {s.title}
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${open === s.key ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open === s.key && (
                    <p className="pb-4 text-sm text-charcoal/60 leading-relaxed">
                      {s.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── YOU MAY ALSO LIKE ── */}
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl font-bold text-charcoal">
              You may also like
            </h2>
            <Link href="/shop" className="text-sm text-sage hover:text-sage-dark transition-colors">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/shop/${p.id}`} className="group block">
                <div className={`${p.bg} rounded-3xl aspect-square flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-[1.02]`}>
                  <span className="text-4xl">🐾</span>
                </div>
                <p className="text-sm font-medium text-charcoal">{p.name}</p>
                <p className="text-sm text-sage font-semibold mt-0.5">{p.price}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
