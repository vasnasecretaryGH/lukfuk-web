"use client";

import { useState } from "react";
import { AlertTriangle, Pencil } from "lucide-react";

const initialInventory = [
  { id: 1, name: "The Luk Evora", category: "House", stock: 14, threshold: 5, sku: "LF-H001" },
  { id: 2, name: "Zig Zag Scratcher", category: "Scratcher", stock: 6, threshold: 5, sku: "LF-S001" },
  { id: 3, name: "CatHat Cave", category: "House", stock: 0, threshold: 5, sku: "LF-H002" },
  { id: 4, name: "Luk Tower Combo", category: "Combo", stock: 4, threshold: 5, sku: "LF-C001" },
  { id: 5, name: "Zen Ceramic Feeder", category: "Combo", stock: 22, threshold: 5, sku: "LF-C002" },
  { id: 6, name: "Bamboo Sisal Scratcher", category: "Scratcher", stock: 3, threshold: 5, sku: "LF-S002" },
];

type Item = typeof initialInventory[0];

function EditModal({ item, onClose, onSave }: { item: Item; onClose: () => void; onSave: (i: Item) => void }) {
  const [stock, setStock] = useState(item.stock);
  const [threshold, setThreshold] = useState(item.threshold);

  return (
    <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-cream rounded-3xl p-8 w-full max-w-sm shadow-xl">
        <h2 className="font-display text-xl font-bold text-charcoal mb-1">Edit Stock</h2>
        <p className="text-sm text-charcoal/40 mb-6">{item.name} · {item.sku}</p>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Stock Quantity</label>
            <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))}
              className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40" />
          </div>
          <div>
            <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Low-Stock Alert Threshold</label>
            <input type="number" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40" />
            <p className="text-xs text-charcoal/40 mt-1">Alert fires when stock falls below this number</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border border-sage/30 text-charcoal py-3 rounded-full text-sm font-medium hover:bg-mint/20 transition-colors">Cancel</button>
          <button onClick={() => { onSave({ ...item, stock, threshold }); onClose(); }}
            className="flex-1 bg-charcoal text-cream py-3 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState(initialInventory);
  const [editing, setEditing] = useState<Item | null>(null);

  const lowStock = inventory.filter((i) => i.stock > 0 && i.stock <= i.threshold);
  const outOfStock = inventory.filter((i) => i.stock === 0);

  const stockBar = (stock: number, threshold: number) => {
    const max = Math.max(stock, threshold * 3, 1);
    const pct = Math.min((stock / max) * 100, 100);
    const color = stock === 0 ? "bg-blush" : stock <= threshold ? "bg-gold" : "bg-sage";
    return { pct, color };
  };

  return (
    <div className="p-8 space-y-6">
      {editing && (
        <EditModal
          item={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) => setInventory((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))}
        />
      )}

      <div>
        <h1 className="font-display text-3xl font-bold text-charcoal">Inventory</h1>
        <p className="text-sm text-charcoal/40 mt-0.5">{inventory.length} products tracked</p>
      </div>

      {/* Alerts */}
      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="space-y-3">
          {outOfStock.map((i) => (
            <div key={i.id} className="flex items-center gap-3 bg-blush/30 rounded-2xl px-5 py-3">
              <AlertTriangle size={15} className="text-blush shrink-0" />
              <p className="text-sm text-charcoal font-medium">{i.name} is out of stock</p>
            </div>
          ))}
          {lowStock.map((i) => (
            <div key={i.id} className="flex items-center gap-3 bg-gold/20 rounded-2xl px-5 py-3">
              <AlertTriangle size={15} className="text-gold shrink-0" />
              <p className="text-sm text-charcoal font-medium">{i.name} is low on stock ({i.stock} remaining)</p>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="bg-cream rounded-3xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sage/20">
              {["Product", "SKU", "Category", "Stock Level", "Qty", ""].map((h) => (
                <th key={h} className="text-left text-xs text-charcoal/40 font-medium px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-sage/10">
            {inventory.map((item) => {
              const { pct, color } = stockBar(item.stock, item.threshold);
              return (
                <tr key={item.id} className="hover:bg-mint/10 transition-colors">
                  <td className="px-6 py-4 font-medium text-charcoal">{item.name}</td>
                  <td className="px-6 py-4 font-mono text-xs text-charcoal/50">{item.sku}</td>
                  <td className="px-6 py-4 text-charcoal/60">{item.category}</td>
                  <td className="px-6 py-4 w-48">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-mint/30 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    {item.stock <= item.threshold && item.stock > 0 && (
                      <p className="text-[10px] text-gold mt-0.5">Below threshold ({item.threshold})</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold text-base ${item.stock === 0 ? "text-blush" : item.stock <= item.threshold ? "text-gold" : "text-charcoal"}`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setEditing(item)}
                      className="w-8 h-8 rounded-xl bg-mint/40 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-mint transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
