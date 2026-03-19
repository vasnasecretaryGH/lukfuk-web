"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

const initialOrders = [
  { id: "LF-9945", customer: "Arisa T.", phone: "081-234-5678", items: "Bamboo Nest ×1", total: 890, status: "Confirmed", courier: "", tracking: "", date: "19 Mar 2025" },
  { id: "LF-9944", customer: "Natcha P.", phone: "082-345-6789", items: "Zig Zag Scratcher ×2", total: 1500, status: "Packed", courier: "Flash Express", tracking: "", date: "19 Mar 2025" },
  { id: "LF-9943", customer: "Somchai K.", phone: "083-456-7890", items: "The Luk Evora ×1", total: 1290, status: "Shipped", courier: "Flash Express", tracking: "TH12345678", date: "18 Mar 2025" },
  { id: "LF-9942", customer: "Warin L.", phone: "084-567-8901", items: "CatHat Cave ×1", total: 1490, status: "Delivered", courier: "Shopee Express", tracking: "SP98765432", date: "18 Mar 2025" },
  { id: "LF-9941", customer: "Patcharee S.", phone: "085-678-9012", items: "Zen Feeder Set ×1", total: 1290, status: "Delivered", courier: "Flash Express", tracking: "TH11223344", date: "17 Mar 2025" },
];

const statuses = ["All", "Confirmed", "Packed", "Shipped", "Delivered"];

const statusColor: Record<string, string> = {
  Confirmed: "bg-charcoal/10 text-charcoal",
  Packed: "bg-blush text-charcoal",
  Shipped: "bg-gold/20 text-charcoal",
  Delivered: "bg-mint text-sage-dark",
};

type Order = typeof initialOrders[0];

function OrderDetailModal({ order, onClose, onSave }: { order: Order; onClose: () => void; onSave: (o: Order) => void }) {
  const [status, setStatus] = useState(order.status);
  const [courier, setCourier] = useState(order.courier);
  const [tracking, setTracking] = useState(order.tracking);

  return (
    <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-cream rounded-3xl p-8 w-full max-w-md shadow-xl">
        <h2 className="font-display text-2xl font-bold text-charcoal mb-1">Order {order.id}</h2>
        <p className="text-sm text-charcoal/40 mb-6">{order.customer} · {order.date}</p>

        <div className="space-y-4">
          <div className="bg-mint/20 rounded-2xl p-4">
            <p className="text-sm font-medium text-charcoal">{order.items}</p>
            <p className="text-sm text-sage font-semibold mt-1">฿{order.total.toLocaleString()}</p>
          </div>

          <div>
            <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Order Status</label>
            <div className="relative mt-1">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40 appearance-none"
              >
                {["Confirmed", "Packed", "Shipped", "Delivered"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Courier</label>
            <div className="relative mt-1">
              <select
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="w-full bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40 appearance-none"
              >
                <option value="">— Select courier —</option>
                <option>Flash Express</option>
                <option>Shopee Express</option>
              </select>
              <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Tracking Number</label>
            <input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. TH12345678"
              className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border border-sage/30 text-charcoal py-3 rounded-full text-sm font-medium hover:bg-mint/20 transition-colors">Cancel</button>
          <button
            onClick={() => { onSave({ ...order, status, courier, tracking }); onClose(); }}
            className="flex-1 bg-charcoal text-cream py-3 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors"
          >
            Save & Notify
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editing, setEditing] = useState<Order | null>(null);

  const filtered = orders
    .filter((o) => filterStatus === "All" || o.status === filterStatus)
    .filter((o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer.toLowerCase().includes(search.toLowerCase())
    );

  const saveOrder = (updated: Order) =>
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));

  return (
    <div className="p-8 space-y-6">
      {editing && (
        <OrderDetailModal order={editing} onClose={() => setEditing(null)} onSave={saveOrder} />
      )}

      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal">Orders</h1>
        <p className="text-sm text-charcoal/40 mt-0.5">{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-cream rounded-2xl px-4 py-2.5">
          <Search size={14} className="text-charcoal/30" />
          <input
            placeholder="Search order or customer…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm text-charcoal bg-transparent focus:outline-none placeholder:text-charcoal/30 w-48"
          />
        </div>
        <div className="flex gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${filterStatus === s ? "bg-charcoal text-cream" : "bg-cream text-charcoal/50 hover:text-charcoal"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-cream rounded-3xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sage/20">
              {["Order ID", "Customer", "Items", "Total", "Courier", "Tracking", "Status", "Date", ""].map((h) => (
                <th key={h} className="text-left text-xs text-charcoal/40 font-medium px-5 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-sage/10">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-mint/10 transition-colors">
                <td className="px-5 py-4 font-medium text-charcoal text-xs">{o.id}</td>
                <td className="px-5 py-4">
                  <p className="font-medium text-charcoal text-xs">{o.customer}</p>
                  <p className="text-[11px] text-charcoal/40">{o.phone}</p>
                </td>
                <td className="px-5 py-4 text-charcoal/60 text-xs">{o.items}</td>
                <td className="px-5 py-4 font-semibold text-charcoal">฿{o.total.toLocaleString()}</td>
                <td className="px-5 py-4 text-charcoal/60 text-xs">{o.courier || "—"}</td>
                <td className="px-5 py-4 font-mono text-xs text-charcoal/60">{o.tracking || "—"}</td>
                <td className="px-5 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[o.status]}`}>
                    {o.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-charcoal/40 text-xs">{o.date}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => setEditing(o)}
                    className="text-xs text-sage hover:text-sage-dark font-medium transition-colors"
                  >
                    Update →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
