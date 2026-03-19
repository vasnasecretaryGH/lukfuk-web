"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Star, MapPin, Settings, LogOut, Copy, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/supabase/auth";
import { getUserPointsHistory, getUserOrders, updateProfile, PointsEntry, Order } from "@/lib/supabase/db";

const statusColor: Record<string, string> = {
  delivered: "bg-mint text-sage-dark",
  shipped: "bg-gold/20 text-charcoal",
  packed: "bg-blush text-charcoal",
  confirmed: "bg-charcoal/10 text-charcoal",
};

const navItems = [
  { key: "orders", label: "My Orders", icon: ShoppingBag },
  { key: "points", label: "My Points", icon: Star },
  { key: "addresses", label: "My Addresses", icon: MapPin },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function AccountPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("points");
  const [copied, setCopied] = useState(false);
  const [pointsHistory, setPointsHistory] = useState<PointsEntry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    getUserPointsHistory(user.id).then(setPointsHistory);
    getUserOrders(user.id).then(setOrders);
  }, [user]);

  useEffect(() => {
    if (profile) setDisplayName(profile.display_name);
  }, [profile]);

  const handleCopy = () => {
    if (!profile?.referral_code) return;
    navigator.clipboard.writeText(profile.referral_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    setSaving(true);
    await updateProfile(user.id, { display_name: displayName });
    await refreshProfile();
    setSaving(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-sage border-t-transparent animate-spin" />
      </div>
    );
  }

  const initials = profile.display_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full md:w-56 shrink-0">
            <div className="bg-cream border border-sage/20 rounded-3xl p-6 text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-mint flex items-center justify-center text-sage font-bold text-xl mx-auto mb-3">
                {initials}
              </div>
              <p className="font-semibold text-charcoal text-sm">{profile.display_name}</p>
              <p className="text-xs text-charcoal/40 mt-0.5">{profile.email || profile.phone}</p>
            </div>
            <nav className="space-y-1">
              {navItems.map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${activeTab === key ? "bg-mint text-charcoal" : "text-charcoal/60 hover:bg-mint/30 hover:text-charcoal"}`}>
                  <Icon size={16} />{label}
                </button>
              ))}
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-blush hover:bg-blush/10 transition-all">
                <LogOut size={16} /> Log Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">

            {/* MY POINTS */}
            {activeTab === "points" && (
              <div className="space-y-6">
                <div className="bg-charcoal rounded-3xl p-8">
                  <p className="text-cream/50 text-xs uppercase tracking-widest mb-2">Available Balance</p>
                  <p className="font-display text-6xl font-bold text-cream">
                    {profile.points.toLocaleString()} <span className="text-2xl font-normal text-cream/40">pts</span>
                  </p>
                  <p className="text-cream/40 text-xs mt-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage inline-block" /> Resets 31 December
                  </p>
                </div>

                <div className="bg-cream border border-sage/20 rounded-3xl p-6">
                  <h2 className="font-display text-xl font-bold text-charcoal mb-1">Invite your paw-friends</h2>
                  <p className="text-sm text-charcoal/50 mb-5">Share your code. When they complete their first order, you earn 5 bonus points.</p>
                  <div className="flex gap-2 flex-wrap">
                    <div className="flex items-center gap-2 bg-mint/40 rounded-full px-4 py-2.5 flex-1 min-w-0">
                      <span className="text-sm font-mono font-medium text-charcoal truncate">{profile.referral_code}</span>
                      <button onClick={handleCopy} className="text-charcoal/40 hover:text-charcoal transition-colors shrink-0">
                        {copied ? <Check size={14} className="text-sage" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <button onClick={handleCopy} className="bg-charcoal text-cream px-5 py-2.5 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors">
                      Copy Link
                    </button>
                  </div>
                </div>

                <div className="bg-cream border border-sage/20 rounded-3xl p-6">
                  <h2 className="font-semibold text-charcoal mb-5">Points History</h2>
                  {pointsHistory.length === 0 ? (
                    <p className="text-sm text-charcoal/40 text-center py-8">No points activity yet.</p>
                  ) : (
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
                            <td className="py-3 text-charcoal/50 text-xs whitespace-nowrap pr-4">
                              {row.created_at ? new Date(row.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                            </td>
                            <td className="py-3 text-charcoal/70">{row.description}</td>
                            <td className={`py-3 text-right font-semibold ${row.amount > 0 ? "text-sage" : "text-blush"}`}>
                              {row.amount > 0 ? `+${row.amount}` : row.amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* MY ORDERS */}
            {activeTab === "orders" && (
              <div className="bg-cream border border-sage/20 rounded-3xl p-6">
                <h2 className="font-semibold text-charcoal mb-5">My Orders</h2>
                {orders.length === 0 ? (
                  <p className="text-sm text-charcoal/40 text-center py-8">No orders yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.map((o) => (
                      <div key={o.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-sage/10 hover:bg-mint/10 transition-colors">
                        <div>
                          <p className="font-medium text-sm text-charcoal">#{o.id?.slice(0, 8).toUpperCase()}</p>
                          <p className="text-xs text-charcoal/40 mt-0.5">{(o.order_items ?? []).map((i) => `${i.name} ×${i.qty}`).join(", ")}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-charcoal text-sm">฿{o.total.toLocaleString()}</p>
                          <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColor[o.status]}`}>
                            {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                          </span>
                          {o.tracking_number && (
                            <span className="text-xs text-charcoal/40 font-mono">{o.tracking_number}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADDRESSES */}
            {activeTab === "addresses" && (
              <div className="bg-cream border border-sage/20 rounded-3xl p-6">
                <h2 className="font-semibold text-charcoal mb-5">My Addresses</h2>
                <div className="border-2 border-dashed border-sage/30 rounded-2xl p-8 text-center">
                  <p className="text-charcoal/40 text-sm mb-3">No saved addresses yet</p>
                  <button className="bg-charcoal text-cream px-5 py-2.5 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors">+ Add Address</button>
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <div className="bg-cream border border-sage/20 rounded-3xl p-6 space-y-4">
                <h2 className="font-semibold text-charcoal mb-5">Settings</h2>
                <div>
                  <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Display Name</label>
                  <input value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/30" />
                </div>
                <div>
                  <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Email</label>
                  <input value={profile.email ?? ""} readOnly
                    className="w-full mt-1 bg-mint/10 rounded-2xl px-4 py-3 text-sm text-charcoal/50 cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Phone</label>
                  <input value={profile.phone ?? ""} readOnly
                    className="w-full mt-1 bg-mint/10 rounded-2xl px-4 py-3 text-sm text-charcoal/50 cursor-not-allowed" />
                </div>
                <button onClick={handleSaveSettings} disabled={saving}
                  className="bg-charcoal text-cream px-6 py-3 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors disabled:opacity-50">
                  {saving ? "Saving…" : "Save Changes"}
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
