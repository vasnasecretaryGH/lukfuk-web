"use client";

import { useState, useEffect } from "react";
import { MapPin, Phone, Clock, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPetShops, PetShop } from "@/lib/supabase/db";

const stores_fallback = [
  {
    id: "1",
    name: "Art Flagship House",
    address: "123 Sukhumvit Soi 10, Khlong Toei",
    district: "Bangkok 10110",
    phone: "02-123-4567",
    hours: "10:00–21:00",
    province: "Bangkok",
  },
  {
    id: 2,
    name: "Sukhumvit & JP Garden",
    address: "45 Sukhumvit Soi 22, Khlong Toei",
    district: "Bangkok 10110",
    phone: "02-234-5678",
    hours: "09:00–20:00",
    province: "Bangkok",
  },
  {
    id: 3,
    name: "Thong Lo Creative District",
    address: "88 Thong Lo Soi 5, Watthana",
    district: "Bangkok 10110",
    phone: "02-345-6789",
    hours: "11:00–21:00",
    province: "Bangkok",
  },
  {
    id: 4,
    name: "Paw Parlour Ari",
    address: "12 Ari Soi 4, Phaya Thai",
    district: "Bangkok 10400",
    phone: "02-456-7890",
    hours: "10:00–20:00",
    province: "Bangkok",
  },
  {
    id: 5,
    name: "The Cat Maker Ekkamai",
    address: "33 Ekkamai Soi 10, Watthana",
    district: "Bangkok 10110",
    phone: "02-567-8901",
    hours: "10:00–21:00",
    province: "Bangkok",
  },
  {
    id: 6,
    name: "Paw Select On Nut",
    address: "200 On Nut Road, Suan Luang",
    district: "Bangkok 10250",
    phone: "02-678-9012",
    hours: "09:00–19:00",
    province: "Bangkok",
  },
];

export default function FindAStorePage() {
  const [stores, setStores] = useState<PetShop[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getPetShops().then((data) => setStores(data.length ? data : stores_fallback as unknown as PetShop[]));
  }, []);

  const filtered = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.district ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (s.province ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      {/* Page header */}
      <div className="bg-mint/40 px-6 py-10 text-center">
        <h1 className="font-display text-4xl font-bold text-charcoal mb-2">
          Find Our Sanctuary
        </h1>
        <p className="text-charcoal/50 text-sm max-w-md mx-auto">
          Discover Lukfuk products at these carefully selected pet shops near you.
          Each stockist shares our love for thoughtful pet care.
        </p>
      </div>

      {/* Search bar */}
      <div className="max-w-2xl mx-auto px-6 -mt-5 relative z-10">
        <div className="flex gap-2 bg-cream border border-sage/30 rounded-full px-4 py-2.5 shadow-sm">
          <Search size={16} className="text-charcoal/30 mt-0.5 shrink-0" />
          <input
            type="text"
            placeholder="Search by city, district or store name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-charcoal bg-transparent placeholder:text-charcoal/30 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-charcoal/30 hover:text-charcoal text-xs transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Map placeholder */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="w-full h-72 bg-mint/30 rounded-4xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-mint/50 to-sage/20" />
          {/* Simulated map pins */}
          {[
            { top: "30%", left: "40%" },
            { top: "50%", left: "55%" },
            { top: "40%", left: "60%" },
            { top: "60%", left: "45%" },
            { top: "35%", left: "50%" },
            { top: "55%", left: "35%" },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute"
              style={{ top: pos.top, left: pos.left }}
            >
              <div className="w-7 h-7 rounded-full bg-sage flex items-center justify-center shadow-md -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform cursor-pointer">
                <MapPin size={13} className="text-cream" fill="currentColor" />
              </div>
            </div>
          ))}
          <div className="relative text-center">
            <p className="text-sage/50 text-sm font-body bg-cream/70 px-4 py-2 rounded-full backdrop-blur-sm">
              กรุงเทพมหานคร — Bangkok
            </p>
          </div>
        </div>
      </div>

      {/* Store cards */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-charcoal/40 text-sm">No stores found for &quot;{search}&quot;</p>
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-sage text-sm hover:text-sage-dark transition-colors"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filtered.map((store) => (
              <div
                key={store.id}
                className="bg-cream border border-sage/20 rounded-3xl p-6 space-y-3 hover:border-sage/50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-charcoal">{store.name}</p>
                  <p className="text-sm text-charcoal/50 mt-0.5">{store.address}</p>
                  <p className="text-sm text-charcoal/50">{store.district}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-charcoal/50">
                    <Phone size={12} className="text-sage shrink-0" />
                    {store.phone}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-charcoal/50">
                    <Clock size={12} className="text-sage shrink-0" />
                    {store.hours}
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/search/${encodeURIComponent(store.name + " " + store.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 border border-charcoal/20 text-charcoal text-xs font-medium px-4 py-2 rounded-full hover:bg-charcoal/5 transition-colors"
                >
                  <MapPin size={11} /> Get Directions
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Can't find nearby */}
        <div className="mt-12 bg-mint/30 rounded-3xl p-8 text-center">
          <p className="font-semibold text-charcoal mb-1">Can&apos;t find us nearby?</p>
          <p className="text-sm text-charcoal/50 mb-4">
            We&apos;re expanding our network of stockists across Thailand.
            Shop directly from us online with fast delivery.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href="/shop"
              className="bg-charcoal text-cream px-6 py-2.5 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors"
            >
              Shop Online
            </a>
            <a
              href="/contact"
              className="border border-charcoal/20 text-charcoal px-6 py-2.5 rounded-full text-sm font-medium hover:bg-charcoal/5 transition-colors"
            >
              Suggest a Location
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
