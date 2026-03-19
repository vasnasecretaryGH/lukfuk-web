import Link from "next/link";
import { ArrowRight, MapPin, Star, RefreshCw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const featuredProducts = [
  { id: 1, name: "The Luk Evora", price: "฿1,290", badge: "Best Seller", bg: "bg-mint" },
  { id: 2, name: "Zig Zag Scratcher", price: "฿890", badge: "New", bg: "bg-blush" },
  { id: 3, name: "CatHat Cave", price: "฿1,490", badge: null, bg: "bg-mint" },
  { id: 4, name: "Luk Tower", price: "฿2,190", badge: "New", bg: "bg-blush" },
];

const nearbyShops = [
  { name: "Paw Parlour", area: "Thong Lo, Bangkok", hours: "10:00–20:00" },
  { name: "The Cat Maker", area: "Ekkamai, Bangkok", hours: "11:00–21:00" },
  { name: "Paw Select", area: "Ari, Bangkok", hours: "09:00–19:00" },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="bg-cream">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-charcoal leading-tight tracking-tight">
              A Home They&apos;ll{" "}
              <span className="italic text-sage">Actually</span> Use
            </h1>
            <p className="text-charcoal/60 text-lg max-w-md leading-relaxed">
              Sustainable cat houses &amp; scratchers handcrafted from premium
              carton. Designed with your cat&apos;s instincts in mind.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-charcoal text-cream px-6 py-3 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors duration-300"
              >
                Shop Now
              </Link>
              <Link
                href="/shop?filter=new"
                className="inline-flex items-center gap-2 border border-charcoal/30 text-charcoal px-6 py-3 rounded-full text-sm font-medium hover:bg-charcoal/5 transition-colors duration-300"
              >
                See New Collection
              </Link>
            </div>
          </div>

          {/* Hero image placeholder */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-md aspect-[4/3] rounded-4xl bg-mint flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-mint to-sage/30" />
              <div className="relative text-sage/40 text-center">
                <div className="text-6xl mb-2">🐱</div>
                <p className="text-sm font-body">Product photo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW COLLECTION BANNER ── */}
      <section className="bg-gradient-to-r from-mint to-sage/60">
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-4">
            <p className="text-sage-dark text-sm font-semibold uppercase tracking-widest">
              New Collection
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal">
              The Sculptural Series 2025
            </h2>
            <p className="text-charcoal/60 max-w-sm leading-relaxed">
              Inspired by Bangkok&apos;s architectural soul, our new line blends
              form and function in ways your cat will love.
            </p>
            <Link
              href="/shop?filter=new"
              className="inline-flex items-center gap-2 bg-charcoal text-cream px-5 py-2.5 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors"
            >
              Explore <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="w-64 h-64 rounded-4xl bg-white/30 flex items-center justify-center backdrop-blur-sm">
              <span className="text-7xl">🏠</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="bg-cream">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-display text-3xl font-bold text-charcoal">
              Our Favourites
            </h2>
            <Link
              href="/shop"
              className="text-sm text-sage hover:text-sage-dark transition-colors font-medium"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featuredProducts.map((p) => (
              <Link
                key={p.id}
                href={`/shop/${p.id}`}
                className="group block"
              >
                <div
                  className={`${p.bg} rounded-3xl aspect-square flex items-center justify-center mb-3 relative overflow-hidden transition-all duration-300 group-hover:scale-[1.02]`}
                >
                  {p.badge && (
                    <span className="absolute top-3 left-3 bg-charcoal text-cream text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      {p.badge}
                    </span>
                  )}
                  <span className="text-5xl">🐾</span>
                </div>
                <p className="font-body font-medium text-charcoal text-sm">
                  {p.name}
                </p>
                <p className="text-sage font-semibold text-sm mt-0.5">
                  {p.price}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOYALTY TEASER ── */}
      <section className="bg-cream px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-charcoal rounded-3xl px-8 py-12 text-center">
            <h2 className="font-display text-3xl font-bold text-cream mb-2">
              Shop direct. Earn points. Save more.
            </h2>
            <p className="text-cream/50 text-sm mb-10">
              Join thousands of cat parents buying directly from us.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <Star size={18} className="text-gold" />
                </div>
                <p className="text-cream font-medium text-sm">Earn 1pt per ฿50</p>
                <p className="text-cream/40 text-xs">On every direct purchase</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="text-gold text-lg">฿</span>
                </div>
                <p className="text-cream font-medium text-sm">Redeem as discount</p>
                <p className="text-cream/40 text-xs">1 point = ฿1 off</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <RefreshCw size={18} className="text-gold" />
                </div>
                <p className="text-cream font-medium text-sm">Resets yearly</p>
                <p className="text-cream/40 text-xs">Points reset 31 December</p>
              </div>
            </div>

            <Link
              href="/account"
              className="inline-flex items-center gap-2 bg-gold text-charcoal px-7 py-3 rounded-full text-sm font-semibold hover:bg-gold/80 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── FIND US NEAR YOU ── */}
      <section className="bg-mint/40">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-charcoal mb-2">
              Find us near you
            </h2>
            <p className="text-charcoal/50 text-sm">
              Available at these fine pet shops across Bangkok
            </p>
          </div>

          {/* Map placeholder */}
          <div className="w-full h-56 bg-mint rounded-3xl flex items-center justify-center mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-mint to-sage/20" />
            <div className="relative flex flex-col items-center gap-2 text-sage/60">
              <MapPin size={28} />
              <span className="text-sm font-body">Interactive map</span>
            </div>
          </div>

          {/* Shop cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nearbyShops.map((shop) => (
              <div
                key={shop.name}
                className="bg-cream rounded-2xl p-5 space-y-1.5"
              >
                <p className="font-semibold text-charcoal font-body">
                  {shop.name}
                </p>
                <p className="text-sm text-charcoal/60">{shop.area}</p>
                <p className="text-xs text-sage font-medium">{shop.hours}</p>
                <Link
                  href="/find-a-store"
                  className="inline-flex items-center gap-1 text-xs text-charcoal/50 hover:text-charcoal mt-2 transition-colors"
                >
                  Get Directions →
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/find-a-store"
              className="inline-flex items-center gap-2 border border-charcoal/20 text-charcoal px-6 py-3 rounded-full text-sm font-medium hover:bg-charcoal/5 transition-colors"
            >
              <MapPin size={14} /> View All Stores
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
