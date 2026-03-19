/**
 * Run once to seed Firestore with initial products and pet shops.
 * Usage: npx ts-node --project tsconfig.json lib/firebase/seed.ts
 * (Or call seedAll() from a temporary admin page)
 */
import { db } from "./config";
import { collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import type { Product, PetShop } from "./firestore";

const products: Omit<Product, "id">[] = [
  {
    nameEn: "The Luk Evora", nameTh: "เดอะ ลูก อีวอร่า",
    descEn: "A minimalist cat house inspired by Bauhaus architecture, crafted from double-wall carton.", descTh: "บ้านแมวสไตล์มินิมอลได้รับแรงบันดาลใจจากสถาปัตยกรรม Bauhaus",
    price: 1290, category: "house", images: [], dimensions: "W40 × D40 × H45 cm", material: "Double-wall carton board",
    stock: 14, isNewCollection: false, badge: "Best Seller", isActive: true,
  },
  {
    nameEn: "Zig Zag Scratcher", nameTh: "ซิก แซก สแครชเชอร์",
    descEn: "A sculptural wave scratcher that doubles as a lounger. Made from layered honeycomb carton.", descTh: "แผ่นข่วนเล็บทรงคลื่นที่ใช้เป็นที่นอนได้ด้วย",
    price: 890, category: "scratcher", images: [], dimensions: "W60 × D30 × H15 cm", material: "Honeycomb carton",
    stock: 6, isNewCollection: true, badge: "New", isActive: true,
  },
  {
    nameEn: "CatHat Cave", nameTh: "แคทแฮท เคฟ",
    descEn: "A cozy igloo-style cave for cats who love to hide. Perfectly sized for most domestic cats.", descTh: "บ้านแมวสไตล์อิกลูสำหรับแมวที่ชอบซ่อนตัว",
    price: 1490, category: "house", images: [], dimensions: "W38 × D38 × H35 cm", material: "Premium carton board",
    stock: 0, isNewCollection: false, badge: null, isActive: true,
  },
  {
    nameEn: "Luk Tower Combo", nameTh: "ลูก ทาวเวอร์ คอมโบ",
    descEn: "A 3-tier activity tower with a scratcher base, play platform, and penthouse hideout.", descTh: "หอกิจกรรม 3 ชั้นพร้อมแผ่นข่วนเล็บ",
    price: 2190, category: "combo", images: [], dimensions: "W50 × D50 × H120 cm", material: "Double-wall + honeycomb carton",
    stock: 4, isNewCollection: true, badge: "New", isActive: true,
  },
  {
    nameEn: "Zen Ceramic Feeder Set", nameTh: "เซน เซรามิก ฟีดเดอร์ เซ็ต",
    descEn: "Elevated ceramic feeding bowls on a bamboo stand. Promotes healthy eating posture.", descTh: "ชุดชามเซรามิกยกสูงบนขาตั้งไม้ไผ่",
    price: 1290, category: "combo", images: [], dimensions: "Stand H15 cm, Bowl ⌀12 cm", material: "Ceramic + bamboo",
    stock: 22, isNewCollection: false, badge: null, isActive: true,
  },
  {
    nameEn: "Bamboo Sisal Scratcher", nameTh: "แบมบู ไซซัล สแครชเชอร์",
    descEn: "Flat lounge scratcher woven from natural sisal fibre on a bamboo frame.", descTh: "แผ่นข่วนเล็บแบนทอจากเส้นใยไซซัลบนโครงไม้ไผ่",
    price: 750, category: "scratcher", images: [], dimensions: "W55 × D35 × H8 cm", material: "Sisal fibre + bamboo",
    stock: 3, isNewCollection: false, badge: null, isActive: true,
  },
];

const petShops: Omit<PetShop, "id">[] = [
  { name: "Art Flagship House", address: "123 Sukhumvit Soi 10", district: "Khlong Toei", province: "Bangkok", phone: "02-123-4567", hours: "10:00–21:00", lat: 13.7440, lng: 100.5605 },
  { name: "Sukhumvit & JP Garden", address: "45 Sukhumvit Soi 22", district: "Khlong Toei", province: "Bangkok", phone: "02-234-5678", hours: "09:00–20:00", lat: 13.7200, lng: 100.5630 },
  { name: "Thong Lo Creative District", address: "88 Thong Lo Soi 5", district: "Watthana", province: "Bangkok", phone: "02-345-6789", hours: "11:00–21:00", lat: 13.7246, lng: 100.5800 },
  { name: "Paw Parlour Ari", address: "12 Ari Soi 4", district: "Phaya Thai", province: "Bangkok", phone: "02-456-7890", hours: "10:00–20:00", lat: 13.7794, lng: 100.5479 },
  { name: "The Cat Maker Ekkamai", address: "33 Ekkamai Soi 10", district: "Watthana", province: "Bangkok", phone: "02-567-8901", hours: "10:00–21:00", lat: 13.7178, lng: 100.5850 },
  { name: "Paw Select On Nut", address: "200 On Nut Road", district: "Suan Luang", province: "Bangkok", phone: "02-678-9012", hours: "09:00–19:00", lat: 13.7006, lng: 100.6011 },
];

export async function seedAll() {
  // Clear and re-seed products
  const prodSnap = await getDocs(collection(db, "products"));
  await Promise.all(prodSnap.docs.map((d) => deleteDoc(d.ref)));
  for (const p of products) await addDoc(collection(db, "products"), p);

  // Clear and re-seed pet shops
  const shopSnap = await getDocs(collection(db, "petShops"));
  await Promise.all(shopSnap.docs.map((d) => deleteDoc(d.ref)));
  for (const s of petShops) await addDoc(collection(db, "petShops"), s);

  console.log("✓ Seeded products and pet shops");
}
