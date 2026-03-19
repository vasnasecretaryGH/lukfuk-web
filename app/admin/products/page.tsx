"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

const initialProducts = [
  { id: 1, name: "The Luk Evora", category: "House", price: 1290, stock: 14, status: "Active", badge: "Best Seller" },
  { id: 2, name: "Zig Zag Scratcher", category: "Scratcher", price: 890, stock: 6, status: "Active", badge: "New" },
  { id: 3, name: "CatHat Cave", category: "House", price: 1490, stock: 0, status: "Out of Stock", badge: null },
  { id: 4, name: "Luk Tower Combo", category: "Combo", price: 2190, stock: 4, status: "Active", badge: "New" },
  { id: 5, name: "Zen Ceramic Feeder", category: "Combo", price: 1290, stock: 22, status: "Active", badge: null },
  { id: 6, name: "Bamboo Sisal Scratcher", category: "Scratcher", price: 750, stock: 3, status: "Low Stock", badge: null },
];

type Product = typeof initialProducts[0];

const stockStatusStyle = (s: string) => {
  if (s === "Active") return "bg-mint text-sage-dark";
  if (s === "Low Stock") return "bg-gold/20 text-charcoal";
  return "bg-blush text-charcoal";
};

function ProductModal({ product, onClose }: { product: Partial<Product> | null; onClose: () => void }) {
  const isNew = !product?.id;
  return (
    <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-cream rounded-3xl p-8 w-full max-w-lg shadow-xl">
        <h2 className="font-display text-2xl font-bold text-charcoal mb-6">
          {isNew ? "Add Product" : "Edit Product"}
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Product Name (EN)</label>
              <input defaultValue={product?.name} className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Product Name (TH)</label>
              <input className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40" />
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Category</label>
              <select defaultValue={product?.category} className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40">
                <option>House</option>
                <option>Scratcher</option>
                <option>Combo</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Price (฿)</label>
              <input type="number" defaultValue={product?.price} className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40" />
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Stock Qty</label>
              <input type="number" defaultValue={product?.stock} className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40" />
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Badge</label>
              <select className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40">
                <option value="">None</option>
                <option>New</option>
                <option>Best Seller</option>
                <option>Low Stock</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Description (EN)</label>
              <textarea rows={3} className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40 resize-none" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Images</label>
              <div className="mt-1 border-2 border-dashed border-sage/30 rounded-2xl p-6 text-center">
                <p className="text-sm text-charcoal/40">Click to upload or drag & drop</p>
                <p className="text-xs text-charcoal/30 mt-1">PNG, JPG up to 5MB each</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border border-sage/30 text-charcoal py-3 rounded-full text-sm font-medium hover:bg-mint/20 transition-colors">Cancel</button>
          <button className="flex-1 bg-charcoal text-cream py-3 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors">
            {isNew ? "Add Product" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<Partial<Product> | null | false>(false);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const deleteProduct = (id: number) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  return (
    <div className="p-8 space-y-6">
      {modal !== false && (
        <ProductModal product={modal} onClose={() => setModal(false)} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal">Products</h1>
          <p className="text-sm text-charcoal/40 mt-0.5">{products.length} total products</p>
        </div>
        <button
          onClick={() => setModal({})}
          className="flex items-center gap-2 bg-charcoal text-cream px-5 py-3 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-cream rounded-2xl px-4 py-3 max-w-sm">
        <Search size={15} className="text-charcoal/30" />
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm text-charcoal bg-transparent focus:outline-none placeholder:text-charcoal/30"
        />
      </div>

      {/* Table */}
      <div className="bg-cream rounded-3xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sage/20">
              {["Product", "Category", "Price", "Stock", "Status", ""].map((h) => (
                <th key={h} className="text-left text-xs text-charcoal/40 font-medium px-6 py-4">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-sage/10">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-mint/10 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-mint/40 rounded-xl flex items-center justify-center text-xl shrink-0">🐾</div>
                    <div>
                      <p className="font-medium text-charcoal">{p.name}</p>
                      {p.badge && (
                        <span className="text-[10px] bg-gold/20 text-charcoal px-2 py-0.5 rounded-full font-medium">{p.badge}</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-charcoal/60">{p.category}</td>
                <td className="px-6 py-4 font-semibold text-charcoal">฿{p.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${p.stock === 0 ? "text-blush" : p.stock <= 5 ? "text-gold" : "text-charcoal"}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${stockStatusStyle(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => setModal(p)}
                      className="w-8 h-8 rounded-xl bg-mint/40 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-mint transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="w-8 h-8 rounded-xl bg-blush/40 flex items-center justify-center text-charcoal/60 hover:text-blush hover:bg-blush/60 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
