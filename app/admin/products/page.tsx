"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct, Product } from "@/lib/firebase/firestore";

const stockStatusStyle = (stock: number) => {
  if (stock === 0) return "bg-blush text-charcoal";
  if (stock <= 5) return "bg-gold/20 text-charcoal";
  return "bg-mint text-sage-dark";
};

const stockLabel = (stock: number) => {
  if (stock === 0) return "Out of Stock";
  if (stock <= 5) return "Low Stock";
  return "Active";
};

function ProductModal({ product, onClose, onSave }: { product: Partial<Product> | null; onClose: () => void; onSave: () => void }) {
  const isNew = !product?.nameEn;
  const [form, setForm] = useState<Partial<Product>>(product ?? {
    nameEn: "", nameTh: "", descEn: "", descTh: "",
    price: 0, category: "house", stock: 0,
    dimensions: "", material: "", badge: null,
    images: [], isNewCollection: false, isActive: true,
  });
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Product>(k: K, v: Product[K]) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    if (isNew) {
      await createProduct(form as Omit<Product, "id">);
    } else if (product?.id) {
      await updateProduct(product.id, form);
    }
    onSave();
    onClose();
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-cream rounded-3xl p-8 w-full max-w-lg shadow-xl my-4">
        <h2 className="font-display text-2xl font-bold text-charcoal mb-6">{isNew ? "Add Product" : "Edit Product"}</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Product Name (EN)</label>
              <input value={form.nameEn ?? ""} onChange={(e) => set("nameEn", e.target.value)}
                className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Product Name (TH)</label>
              <input value={form.nameTh ?? ""} onChange={(e) => set("nameTh", e.target.value)}
                className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40" />
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Category</label>
              <select value={form.category ?? "house"} onChange={(e) => set("category", e.target.value as Product["category"])}
                className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40">
                <option value="house">House</option>
                <option value="scratcher">Scratcher</option>
                <option value="combo">Combo</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Price (฿)</label>
              <input type="number" value={form.price ?? 0} onChange={(e) => set("price", Number(e.target.value))}
                className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40" />
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Stock Qty</label>
              <input type="number" value={form.stock ?? 0} onChange={(e) => set("stock", Number(e.target.value))}
                className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40" />
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Badge</label>
              <select value={form.badge ?? ""} onChange={(e) => set("badge", e.target.value || null)}
                className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40">
                <option value="">None</option>
                <option value="New">New</option>
                <option value="Best Seller">Best Seller</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Description (EN)</label>
              <textarea rows={3} value={form.descEn ?? ""} onChange={(e) => set("descEn", e.target.value)}
                className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40 resize-none" />
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Dimensions</label>
              <input value={form.dimensions ?? ""} onChange={(e) => set("dimensions", e.target.value)}
                placeholder="e.g. W40 × D40 × H45 cm"
                className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40" />
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Material</label>
              <input value={form.material ?? ""} onChange={(e) => set("material", e.target.value)}
                className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40" />
            </div>
            <div className="col-span-2 flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isNewCollection ?? false} onChange={(e) => set("isNewCollection", e.target.checked)} className="accent-sage" />
                <span className="text-sm text-charcoal/70">New Collection</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive ?? true} onChange={(e) => set("isActive", e.target.checked)} className="accent-sage" />
                <span className="text-sm text-charcoal/70">Active (visible in shop)</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border border-sage/30 text-charcoal py-3 rounded-full text-sm font-medium hover:bg-mint/20 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-charcoal text-cream py-3 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors disabled:opacity-50">
            {saving ? "Saving…" : isNew ? "Add Product" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<Partial<Product> | null | false>(false);

  const load = () => getProducts().then((p) => { setProducts(p); setLoading(false); });
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    load();
  };

  const filtered = products.filter((p) =>
    p.nameEn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      {modal !== false && (
        <ProductModal product={modal} onClose={() => setModal(false)} onSave={load} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal">Products</h1>
          <p className="text-sm text-charcoal/40 mt-0.5">{products.length} total products</p>
        </div>
        <button onClick={() => setModal({})}
          className="flex items-center gap-2 bg-charcoal text-cream px-5 py-3 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="flex items-center gap-3 bg-cream rounded-2xl px-4 py-3 max-w-sm">
        <Search size={15} className="text-charcoal/30" />
        <input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm text-charcoal bg-transparent focus:outline-none placeholder:text-charcoal/30" />
      </div>

      <div className="bg-cream rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-charcoal/40">Loading…</div>
        ) : (
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
                      <div className="w-10 h-10 bg-mint/40 rounded-xl flex items-center justify-center text-xl shrink-0">
                        {p.images[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover rounded-xl" /> : "🐾"}
                      </div>
                      <div>
                        <p className="font-medium text-charcoal">{p.nameEn}</p>
                        {p.badge && <span className="text-[10px] bg-gold/20 text-charcoal px-2 py-0.5 rounded-full font-medium">{p.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-charcoal/60 capitalize">{p.category}</td>
                  <td className="px-6 py-4 font-semibold text-charcoal">฿{p.price.toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-charcoal">{p.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${stockStatusStyle(p.stock)}`}>{stockLabel(p.stock)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => setModal(p)}
                        className="w-8 h-8 rounded-xl bg-mint/40 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-mint transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => p.id && handleDelete(p.id)}
                        className="w-8 h-8 rounded-xl bg-blush/40 flex items-center justify-center text-charcoal/60 hover:text-blush hover:bg-blush/60 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
