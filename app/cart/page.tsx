"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Trash2 } from "lucide-react";

const initialItems = [
  { id: 1, name: "Organic Cotton Cat Nest", variant: "Size M | Cream", price: 1250, qty: 1, bg: "bg-mint" },
  { id: 2, name: "Bamboo & Sisal Scratcher", variant: "Material: Natural Bamboo", price: 890, qty: 1, bg: "bg-blush" },
];

const POINTS_BALANCE = 245;

export default function CartPage() {
  const [items, setItems] = useState(initialItems);
  const [pointsUsed, setPointsUsed] = useState(0);
  const [shipping, setShipping] = useState<"flash" | "shopee">("flash");
  const [payment, setPayment] = useState<"promptpay" | "card" | "truemoney">("promptpay");
  const [promoCode, setPromoCode] = useState("");

  const shippingFee = shipping === "flash" ? 45 : 35;
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + shippingFee - pointsUsed;

  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl font-bold text-charcoal mb-10">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── LEFT: Cart + Checkout ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Cart items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center bg-cream rounded-2xl p-4 border border-sage/10">
                  <div className={`${item.bg} w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shrink-0`}>
                    🐾
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-charcoal truncate">{item.name}</p>
                    <p className="text-xs text-charcoal/40 mt-0.5">{item.variant}</p>
                    <p className="text-sage font-semibold text-sm mt-1">฿{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-mint/40 rounded-full px-3 py-1.5">
                    <button onClick={() => updateQty(item.id, -1)} className="text-charcoal/60 hover:text-charcoal">−</button>
                    <span className="text-sm font-medium w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="text-charcoal/60 hover:text-charcoal">+</button>
                  </div>
                  <button onClick={() => updateQty(item.id, -item.qty)} className="text-charcoal/30 hover:text-blush transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Promo + Points */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Promo code */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo / referral code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-mint/20 rounded-full px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40"
                />
                <button className="bg-charcoal text-cream px-5 py-2.5 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors">
                  Apply
                </button>
              </div>

              {/* Points redemption */}
              <div className="bg-blush/40 rounded-2xl p-4">
                <p className="text-xs font-semibold text-charcoal mb-1">
                  Lukfuk Rewards — You have{" "}
                  <span className="text-sage">{POINTS_BALANCE} pts (= ฿{POINTS_BALANCE})</span>
                </p>
                <input
                  type="range"
                  min={0}
                  max={Math.min(POINTS_BALANCE, subtotal)}
                  value={pointsUsed}
                  onChange={(e) => setPointsUsed(Number(e.target.value))}
                  className="w-full accent-sage mt-2"
                />
                <div className="flex justify-between text-xs text-charcoal/50 mt-1">
                  <span>0 pts</span>
                  <span className="text-sage font-medium">Using {pointsUsed} pts (−฿{pointsUsed})</span>
                  <span>{POINTS_BALANCE} pts</span>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-charcoal text-cream text-xs flex items-center justify-center font-bold">1</span>
                <h2 className="font-semibold text-charcoal">Shipping & Delivery</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { key: "flash", label: "Flash Express", fee: 45, days: "2–3 days" },
                  { key: "shopee", label: "Shopee Express", fee: 35, days: "3–5 days" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setShipping(opt.key as "flash" | "shopee")}
                    className={`border-2 rounded-2xl p-4 text-left transition-all ${shipping === opt.key ? "border-charcoal bg-mint/20" : "border-sage/20 hover:border-sage/50"}`}
                  >
                    <p className="font-medium text-sm text-charcoal">{opt.label}</p>
                    <p className="text-xs text-charcoal/50 mt-0.5">Est. arrival {opt.days}</p>
                    <p className="text-sage font-semibold text-sm mt-1">฿{opt.fee}</p>
                  </button>
                ))}
              </div>

              {/* Address form */}
              <div className="grid grid-cols-2 gap-3">
                {["Full Name", "Phone Number", "Street Address", "", "District", "Province", "Postcode", ""].map((label, i) =>
                  label ? (
                    <input
                      key={i}
                      placeholder={label}
                      className={`${["Street Address"].includes(label) ? "col-span-2" : ""} bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/30`}
                    />
                  ) : null
                )}
              </div>
            </div>

            {/* Payment */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-charcoal text-cream text-xs flex items-center justify-center font-bold">2</span>
                <h2 className="font-semibold text-charcoal">Payment Method</h2>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { key: "promptpay", label: "PromptPay", icon: "⚡" },
                  { key: "card", label: "Credit Card", icon: "💳" },
                  { key: "truemoney", label: "TrueMoney", icon: "💰" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setPayment(opt.key as typeof payment)}
                    className={`border-2 rounded-2xl p-4 text-center transition-all ${payment === opt.key ? "border-charcoal bg-mint/20" : "border-sage/20 hover:border-sage/50"}`}
                  >
                    <div className="text-2xl mb-1">{opt.icon}</div>
                    <p className="text-xs font-medium text-charcoal">{opt.label}</p>
                  </button>
                ))}
              </div>

              {payment === "card" && (
                <div className="space-y-3">
                  <input
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/30"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="MM/YY" className="bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/30" />
                    <input placeholder="CVV" className="bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/30" />
                  </div>
                </div>
              )}

              {payment === "promptpay" && (
                <div className="bg-mint/20 rounded-2xl p-6 flex flex-col items-center gap-3">
                  <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center text-4xl border border-sage/20">
                    📱
                  </div>
                  <p className="text-xs text-charcoal/50">Scan QR code with your banking app</p>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-cream border border-sage/20 rounded-3xl p-6 space-y-4">
              <h2 className="font-semibold text-charcoal">Order Summary</h2>

              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-charcoal/70">
                    <span className="truncate mr-2">{item.name} ×{item.qty}</span>
                    <span className="shrink-0">฿{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-sage/20 pt-3 space-y-2">
                <div className="flex justify-between text-sm text-charcoal/60">
                  <span>Subtotal</span>
                  <span>฿{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-charcoal/60">
                  <span>Shipping</span>
                  <span>฿{shippingFee}</span>
                </div>
                {pointsUsed > 0 && (
                  <div className="flex justify-between text-sm text-sage font-medium">
                    <span>Rewards Applied</span>
                    <span>−฿{pointsUsed}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-sage/20 pt-3 flex justify-between font-bold text-charcoal">
                <span>Total</span>
                <span>฿{total.toLocaleString()}</span>
              </div>

              <p className="text-[10px] text-charcoal/30 text-center">VAT included</p>

              <button className="w-full bg-charcoal text-cream py-4 rounded-full font-semibold hover:bg-charcoal/80 transition-colors flex items-center justify-center gap-2">
                Place Order →
              </button>

              <div className="flex items-center justify-center gap-4 pt-1">
                <span className="text-xs text-charcoal/30">🔒 Secure checkout</span>
                <span className="text-xs text-charcoal/30">↩ Easy returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
