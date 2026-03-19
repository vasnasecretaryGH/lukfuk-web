import { TrendingUp, ShoppingBag, Users, Package } from "lucide-react";

const stats = [
  { label: "Total Revenue", value: "฿128,450", change: "+12%", icon: TrendingUp, color: "bg-mint" },
  { label: "Total Orders", value: "342", change: "+8%", icon: ShoppingBag, color: "bg-blush" },
  { label: "Customers", value: "1,204", change: "+23%", icon: Users, color: "bg-gold/30" },
  { label: "Products", value: "24", change: "active", icon: Package, color: "bg-mint" },
];

const recentOrders = [
  { id: "LF-9945", customer: "Arisa T.", items: "Bamboo Nest ×1", total: "฿890", status: "Confirmed", date: "19 Mar 2025" },
  { id: "LF-9944", customer: "Natcha P.", items: "Zig Zag Scratcher ×2", total: "฿1,500", status: "Packed", date: "19 Mar 2025" },
  { id: "LF-9943", customer: "Somchai K.", items: "The Luk Evora ×1", total: "฿1,290", status: "Shipped", date: "18 Mar 2025" },
  { id: "LF-9942", customer: "Warin L.", items: "CatHat Cave ×1", total: "฿1,490", status: "Delivered", date: "18 Mar 2025" },
  { id: "LF-9941", customer: "Patcharee S.", items: "Zen Feeder Set ×1", total: "฿1,290", status: "Delivered", date: "17 Mar 2025" },
];

const topProducts = [
  { name: "Zig Zag Scratcher", sold: 89, revenue: "฿66,750" },
  { name: "The Luk Evora", sold: 64, revenue: "฿82,560" },
  { name: "Bamboo Nest", sold: 51, revenue: "฿45,390" },
  { name: "CatHat Cave", sold: 38, revenue: "฿56,620" },
];

const statusColor: Record<string, string> = {
  Confirmed: "bg-charcoal/10 text-charcoal",
  Packed: "bg-blush text-charcoal",
  Shipped: "bg-gold/20 text-charcoal",
  Delivered: "bg-mint text-sage-dark",
};

export default function AdminDashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal">Dashboard</h1>
          <p className="text-sm text-charcoal/40 mt-0.5">Thursday, 19 March 2025</p>
        </div>
        <select className="bg-cream border border-sage/30 text-sm text-charcoal rounded-full px-4 py-2 focus:outline-none focus:border-sage">
          <option>This Month</option>
          <option>This Week</option>
          <option>Today</option>
          <option>Custom Range</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-cream rounded-3xl p-6">
            <div className={`w-10 h-10 ${s.color} rounded-2xl flex items-center justify-center mb-4`}>
              <s.icon size={18} className="text-charcoal/70" />
            </div>
            <p className="text-2xl font-bold text-charcoal font-display">{s.value}</p>
            <p className="text-xs text-charcoal/40 mt-0.5">{s.label}</p>
            <span className="inline-block mt-2 text-xs font-medium text-sage bg-mint/50 px-2 py-0.5 rounded-full">
              {s.change}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-cream rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-charcoal">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs text-sage hover:text-sage-dark transition-colors">
              View All →
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sage/20">
                  {["Order", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left text-xs text-charcoal/40 font-medium pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/10">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-mint/10 transition-colors">
                    <td className="py-3 pr-4 font-medium text-charcoal text-xs">{o.id}</td>
                    <td className="py-3 pr-4 text-charcoal/70">{o.customer}</td>
                    <td className="py-3 pr-4 text-charcoal/50 text-xs">{o.items}</td>
                    <td className="py-3 pr-4 font-semibold text-charcoal">{o.total}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-charcoal/40 text-xs">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-cream rounded-3xl p-6">
          <h2 className="font-semibold text-charcoal mb-5">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-mint/60 flex items-center justify-center text-xs font-bold text-charcoal/50">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">{p.name}</p>
                  <p className="text-xs text-charcoal/40">{p.sold} sold</p>
                </div>
                <p className="text-sm font-semibold text-charcoal shrink-0">{p.revenue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
