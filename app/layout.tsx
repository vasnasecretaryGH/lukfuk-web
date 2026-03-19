import type { Metadata } from "next";
import { Playfair_Display, Poppins, Mitr } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const mitr = Mitr({
  variable: "--font-thai",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Lukfuk.BKK — Sustainable Cat Houses & Scratchers",
  description:
    "Handcrafted sustainable cat houses and scratchers made from premium carton. Shop direct, earn points, save more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${playfair.variable} ${poppins.variable} ${mitr.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-body antialiased">
        {children}
      </body>
    </html>
  );
}
