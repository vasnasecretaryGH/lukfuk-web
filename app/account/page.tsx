"use client";

import { useState } from "react";
import { ShoppingBag, Star, MapPin, Settings, LogOut, Copy, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const pointsHistory = [
  { date: "12 Oct 2024", description: "Order #LF-9921 Organic Tofu Litter", points: +120 },
  { date: "05 Oct 2024", description: "Friend Referral (Lisa W.)", points: +500 },
  { date: "28 Sep 2024", description: "Redeemed Eco-Bowl 15cm", points: -800 },
  { date: "15 Sep 2024", description: "Order #LF-9788 Bamboo Nest", points: +350 },
  { date: "01 Sep 2024", description: "First Purchase Bonus", points: +10 },
];

const orders = [
  { id: "LF-9921", date: "12 Oct 2024", items: "Organic Tofu Litter ×2", total: "฿1,250", status: "Delivered" },
  { id: "LF-9788", date: "15 Sep 2024", items: "Bamboo Nest ×1", total: "฿890", status: "Delivered" },
  { id: "LF-9612", date: "03 Aug 2024", items: "Zig Zag Scratcher ×1", total: "฿750", status: "Delivered" },
];

const statusColor: Record<string, string> = {
  Delivered: "bg-mint text-sage-dark",
  Shipped: "bg-gold/20 text-charcoal",
  Packed: "bg-blush text-charcoal",
  Confirmed: "bg-charcoal/10 text-charcoal",
};

const navItems = [
  { key: "orders", label: "My Orders", icon: ShoppingBag },
  { key: "points", label: "My Points", icon: Star },
  { key: "addresses", label: "My Addresses", icon: MapPin },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("points");
  const [copied, setCopied] = useState(false);
  const referralCode = "LUKFUK-PET-2024";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">

          {/* ── SIDEBAR ── */}
          <aside className="w-full md:w-56 shrink-0">
            <div className="bg-cream border border-sage/20 rounded-3xl p-6 text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-mint flex items-center justify-center text-sage font-bold text-xl mx-auto mb-3">
                SK
              </div>
              <p className="font-semibold text-charcoal text-sm">Somchai K.</p>
              <p className="text-xs text-charcoal/40 mt-0.5">Member since March 2023</p>
            </div>

            <nav className="space-y-1">
              {navItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    activeTab === key
                      ? "bg-mint text-charcoal"
                      : "text-charcoal/60 hover:bg-mint/30 hover:text-charcoal"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-blush hover:bg-blush/10 transition-all">
                <LogOut size={16} />
                Log Out
              </button>
            </nav>
          </aside>

          {/* ── CONTENT ── */}
          <div className="flex-1">

            {/* MY POINTS */}
            {activeTab === "points" && (
              <div className="space-y-6">
                {/* Balance card */}
                <div className="bg-charcoal rounded-3xl p-8">
                  <p className="text-cream/50 text-xs uppercase tracking-widest mb-2">Available Balance</p>
                  <p className="font-display text-6xl font-bold text-cream">
                    2,450 <span className="text-2xl font-normal text-cream/40">pts</span>
                  </p>
                  <p className="text-cream/40 text-xs mt-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage inline-block" />
                    Resets 31 December
                  </p>
                </div>

                {/* Referral */}
                <div className="bg-cream border border-sage/20 rounded-3xl p-6">
                  <h2 className="font-display text-xl font-bold text-charcoal mb-1">
                    Invite your paw-friends
                  </h2>
                  <p className="text-sm text-charcoal/50 mb-5">
                    Share your unique code. When they make their first purchase, you both earn bonus points.
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <div className="flex items-center gap-2 bg-mint/40 rounded-full px-4 py-2.5 flex-1 min-w-0">
                      <span className="text-sm font-mono font-medium text-charcoal truncate">
                        {referralCode}
                      </span>
                      <button onClick={handleCopy} className="text-charcoal/40 hover:text-charcoal transition-colors shrink-0">
                        {copied ? <Check size={14} className="text-sage" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <button className="bg-[#06C755] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#06C755]/80 transition-colors">
                      LINE
                    </button>
                    <button
                      onClick={handleCopy}
                      className="bg-charcoal text-cream px-5 py-2.5 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors"
                    >
                      Copy Link
                    </button>
                  </div>
                </div>

                {/* Points history */}
                <div className="bg-cream border border-sage/20 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-semibold text-charcoal">Points History</h2>
                    <button className="text-xs text-sage hover:text-sage-dark transition-colors">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-sage/20">
                          <th className="text-left text-xs text-charcoal/40 font-medium pb-3">Date</th>
                          <th className="text-left text-xs text-charcoal/40 font-medium pb-3">Description</th>
                          <th className="text-right text-xs text-charcoal/40 font-medium pb-3">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sage/10">
                        {pointsHistory.map((row, i) => (
                          <tr key={i} className="hover:bg-mint/10 transition-colors">
                            <td className="py-3 text-charcoal/50 text-xs whitespace-nowrap pr-4">{row.date}</td>
                            <td className="py-3 text-charcoal/70">{row.description}</td>
                            <td className={`py-3 text-right font-semibold ${row.points > 0 ? "text-sage" : "text-blush"}`}>
                              {row.points > 0 ? `+${row.points}` : row.points}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* MY ORDERS */}
            {activeTab === "orders" && (
              <div className="bg-cream border border-sage/20 rounded-3xl p-6">
                <h2 className="font-semibold text-charcoal mb-5">My Orders</h2>
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div key={o.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-sage/10 hover:bg-mint/10 transition-colors">
                      <div>
                        <p className="font-medium text-sm text-charcoal">#{o.id}</p>
                        <p className="text-xs text-charcoal/40 mt-0.5">{o.date} · {o.items}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="font-semibold text-charcoal text-sm">{o.total}</p>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[o.status]}`}>
                          {o.status}
                        </span>
                        <button className="text-xs text-sage hover:text-sage-dark transition-colors font-medium">
                          Track →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADDRESSES */}
            {activeTab === "addresses" && (
              <div className="bg-cream border border-sage/20 rounded-3xl p-6">
                <h2 className="font-semibold text-charcoal mb-5">My Addresses</h2>
                <div className="border-2 border-dashed border-sage/30 rounded-2xl p-8 text-center">
                  <p className="text-charcoal/40 text-sm mb-3">No saved addresses yet</p>
                  <button className="bg-charcoal text-cream px-5 py-2.5 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors">
                    + Add Address
                  </button>
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <div className="bg-cream border border-sage/20 rounded-3xl p-6 space-y-4">
                <h2 className="font-semibold text-charcoal mb-5">Settings</h2>
                {["Display Name", "Email", "Phone Number"].map((field) => (
                  <div key={field}>
                    <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">{field}</label>
                    <input
                      className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/30"
                      placeholder={field}
                    />
                  </div>
                ))}
                <button className="bg-charcoal text-cream px-6 py-3 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors mt-2">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
