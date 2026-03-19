"use client";

import { useState } from "react";
import { Search, Plus, Minus } from "lucide-react";

const initialCustomers = [
  { id: 1, name: "Somchai K.", phone: "083-456-7890", email: "somchai@email.com", points: 2450, orders: 8, joined: "Mar 2023" },
  { id: 2, name: "Arisa T.", phone: "081-234-5678", email: "arisa@email.com", points: 320, orders: 2, joined: "Jan 2025" },
  { id: 3, name: "Natcha P.", phone: "082-345-6789", email: "natcha@email.com", points: 1100, orders: 5, joined: "Jun 2024" },
  { id: 4, name: "Warin L.", phone: "084-567-8901", email: "warin@email.com", points: 50, orders: 1, joined: "Feb 2025" },
  { id: 5, name: "Patcharee S.", phone: "085-678-9012", email: "patcharee@email.com", points: 780, orders: 4, joined: "Sep 2024" },
];

type Customer = typeof initialCustomers[0];

function PointsModal({ customer, onClose, onSave }: { customer: Customer; onClose: () => void; onSave: (c: Customer) => void }) {
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<"add" | "deduct">("add");
  const [reason, setReason] = useState("");

  const newBalance = type === "add" ? customer.points + amount : Math.max(0, customer.points - amount);

  return (
    <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-cream rounded-3xl p-8 w-full max-w-md shadow-xl">
        <h2 className="font-display text-xl font-bold text-charcoal mb-1">Adjust Points</h2>
        <p className="text-sm text-charcoal/40 mb-6">{customer.name} · Current: {customer.points.toLocaleString()} pts</p>

        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setType("add")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium border-2 transition-all ${type === "add" ? "border-sage bg-mint/30 text-charcoal" : "border-sage/20 text-charcoal/50 hover:border-sage/50"}`}
            >
              <Plus size={14} /> Add Points
            </button>
            <button
              onClick={() => setType("deduct")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium border-2 transition-all ${type === "deduct" ? "border-blush bg-blush/20 text-charcoal" : "border-sage/20 text-charcoal/50 hover:border-sage/50"}`}
            >
              <Minus size={14} /> Deduct Points
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Points Amount</label>
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Reason (required)</label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Complaint resolution, Promotion bonus"
              className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40"
            />
          </div>

          <div className="bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal flex justify-between">
            <span>New balance after adjustment:</span>
            <span className="font-bold text-sage">{newBalance.toLocaleString()} pts</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border border-sage/30 text-charcoal py-3 rounded-full text-sm font-medium hover:bg-mint/20 transition-colors">Cancel</button>
          <button
            disabled={!reason || amount === 0}
            onClick={() => { onSave({ ...customer, points: newBalance }); onClose(); }}
            className="flex-1 bg-charcoal text-cream py-3 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Apply Adjustment
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [adjusting, setAdjusting] = useState<Customer | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  return (
    <div className="p-8 space-y-6">
      {adjusting && (
        <PointsModal
          customer={adjusting}
          onClose={() => setAdjusting(null)}
          onSave={(updated) => setCustomers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))}
        />
      )}

      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal">Customers</h1>
        <p className="text-sm text-charcoal/40 mt-0.5">{customers.length} registered customers</p>
      </div>

      <div className="flex items-center gap-2 bg-cream rounded-2xl px-4 py-2.5 max-w-sm">
        <Search size={14} className="text-charcoal/30" />
        <input
          placeholder="Search by name or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-sm text-charcoal bg-transparent focus:outline-none placeholder:text-charcoal/30 w-full"
        />
      </div>

      <div className="bg-cream rounded-3xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sage/20">
              {["Customer", "Phone", "Orders", "Points Balance", "Joined", ""].map((h) => (
                <th key={h} className="text-left text-xs text-charcoal/40 font-medium px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-sage/10">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-mint/10 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-mint flex items-center justify-center text-xs font-bold text-charcoal/60">
                      {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-charcoal">{c.name}</p>
                      <p className="text-xs text-charcoal/40">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-charcoal/60">{c.phone}</td>
                <td className="px-6 py-4 text-charcoal/60">{c.orders}</td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-charcoal">{c.points.toLocaleString()}</span>
                  <span className="text-charcoal/40 text-xs"> pts</span>
                </td>
                <td className="px-6 py-4 text-charcoal/40 text-xs">{c.joined}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setAdjusting(c)}
                    className="text-xs text-sage hover:text-sage-dark font-medium transition-colors"
                  >
                    Adjust Points →
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
