import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";

const shopLinks = [
  { label: "New Arrivals", href: "/shop?filter=new" },
  { label: "Houses", href: "/shop?category=house" },
  { label: "Scratchers", href: "/shop?category=scratcher" },
  { label: "Combos", href: "/shop?category=combo" },
];

const helpLinks = [
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-cream border-t border-sage/20 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="font-display text-xl font-semibold text-charcoal mb-3">
              Lukfuk.BKK
            </p>
            <p className="text-sm text-charcoal/60 leading-relaxed max-w-xs">
              Consciously crafted cat houses & scratchers made from sustainable
              premium carton.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal/40 mb-4">
              Shop
            </p>
            <ul className="space-y-2.5">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-charcoal/70 hover:text-charcoal transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal/40 mb-4">
              Help
            </p>
            <ul className="space-y-2.5">
              {helpLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-charcoal/70 hover:text-charcoal transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-charcoal/40 mb-4">
              Follow Us
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-mint flex items-center justify-center text-charcoal/70 hover:bg-sage hover:text-white transition-all duration-300"
              >
                <Instagram size={15} />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-mint flex items-center justify-center text-charcoal/70 hover:bg-sage hover:text-white transition-all duration-300"
              >
                <Facebook size={15} />
              </a>
              {/* Line icon */}
              <a
                href="#"
                aria-label="Line"
                className="w-9 h-9 rounded-full bg-mint flex items-center justify-center text-charcoal/70 hover:bg-sage hover:text-white transition-all duration-300 text-xs font-bold"
              >
                LINE
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-sage/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-charcoal/40">
            © 2025 Lukfuk.BKK. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-charcoal/40">
            <Link href="/privacy" className="hover:text-charcoal transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-charcoal transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
