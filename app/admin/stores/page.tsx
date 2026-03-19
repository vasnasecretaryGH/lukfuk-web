"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";

const initialStores = [
  { id: 1, name: "Art Flagship House", address: "123 Sukhumvit Soi 10", district: "Khlong Toei", province: "Bangkok", phone: "02-123-4567", hours: "10:00–21:00", lat: 13.7563, lng: 100.5018 },
  { id: 2, name: "Sukhumvit & JP Garden", address: "45 Sukhumvit Soi 22", district: "Khlong Toei", province: "Bangkok", phone: "02-234-5678", hours: "09:00–20:00", lat: 13.7200, lng: 100.5630 },
  { id: 3, name: "Thong Lo Creative District", address: "88 Thong Lo Soi 5", district: "Watthana", province: "Bangkok", phone: "02-345-6789", hours: "11:00–21:00", lat: 13.7246, lng: 100.5800 },
];

type Store = typeof initialStores[0];

function StoreModal({ store, onClose, onSave }: { store: Partial<Store> | null; onClose: () => void; onSave: (s: Store) => void }) {
  const isNew = !store?.id;
  const [form, setForm] = useState<Partial<Store>>(store || {});
  const set = (k: keyof Store, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-cream rounded-3xl p-8 w-full max-w-lg shadow-xl">
        <h2 className="font-display text-2xl font-bold text-charcoal mb-6">
          {isNew ? "Add Pet Shop" : "Edit Pet Shop"}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Shop Name</label>
            <input defaultValue={form.name} onChange={(e) => set("name", e.target.value)}
              className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40" />
          </div>
          <div>
            <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Street Address</label>
            <input defaultValue={form.address} onChange={(e) => set("address", e.target.value)}
              className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">District</label>
              <input defaultValue={form.district} onChange={(e) => set("district", e.target.value)}
                className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40" />
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Province</label>
              <input defaultValue={form.province} onChange={(e) => set("province", e.target.value)}
                className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40" />
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Phone</label>
              <input defaultValue={form.phone} onChange={(e) => set("phone", e.target.value)}
                className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40" />
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Opening Hours</label>
              <input defaultValue={form.hours} onChange={(e) => set("hours", e.target.value)}
                placeholder="e.g. 10:00–21:00"
                className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40" />
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Latitude</label>
              <input type="number" defaultValue={form.lat} onChange={(e) => set("lat", parseFloat(e.target.value))}
                placeholder="13.7563"
                className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40" />
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Longitude</label>
              <input type="number" defaultValue={form.lng} onChange={(e) => set("lng", parseFloat(e.target.value))}
                placeholder="100.5018"
                className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 border border-sage/30 text-charcoal py-3 rounded-full text-sm font-medium hover:bg-mint/20 transition-colors">Cancel</button>
          <button
            onClick={() => { onSave({ id: store?.id ?? Date.now(), ...form } as Store); onClose(); }}
            className="flex-1 bg-charcoal text-cream py-3 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors"
          >
            {isNew ? "Add Shop" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminStoresPage() {
  const [stores, setStores] = useState(initialStores);
  const [modal, setModal] = useState<Partial<Store> | null | false>(false);

  const deleteStore = (id: number) => setStores((prev) => prev.filter((s) => s.id !== id));
  const saveStore = (updated: Store) =>
    setStores((prev) =>
      prev.some((s) => s.id === updated.id)
        ? prev.map((s) => (s.id === updated.id ? updated : s))
        : [...prev, updated]
    );

  return (
    <div className="p-8 space-y-6">
      {modal !== false && (
        <StoreModal store={modal} onClose={() => setModal(false)} onSave={saveStore} />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal">Pet Shops</h1>
          <p className="text-sm text-charcoal/40 mt-0.5">{stores.length} stockist locations</p>
        </div>
        <button
          onClick={() => setModal({})}
          className="flex items-center gap-2 bg-charcoal text-cream px-5 py-3 rounded-full text-sm font-medium hover:bg-charcoal/80 transition-colors"
        >
          <Plus size={16} /> Add Shop
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map((store) => (
          <div key={store.id} className="bg-cream rounded-3xl p-6 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <p className="font-semibold text-charcoal leading-snug">{store.name}</p>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => setModal(store)}
                  className="w-8 h-8 rounded-xl bg-mint/40 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-mint transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => deleteStore(store.id)}
                  className="w-8 h-8 rounded-xl bg-blush/40 flex items-center justify-center text-charcoal/60 hover:text-blush hover:bg-blush/60 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <p className="text-sm text-charcoal/60">{store.address}</p>
            <p className="text-sm text-charcoal/60">{store.district}, {store.province}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-charcoal/50">
              <span>📞 {store.phone}</span>
              <span>🕙 {store.hours}</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-charcoal/30 font-mono">
              <MapPin size={10} />
              {store.lat.toFixed(4)}, {store.lng.toFixed(4)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
