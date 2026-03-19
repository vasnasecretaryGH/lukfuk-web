import { supabase } from "./client";

// ── TYPES ──────────────────────────────────────────────────────

export interface Profile {
  id: string;
  display_name: string;
  email: string | null;
  phone: string | null;
  lang: "TH" | "EN";
  points: number;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name_en: string;
  name_th: string;
  desc_en: string | null;
  desc_th: string | null;
  price: number;
  category: "house" | "scratcher" | "combo";
  images: string[];
  dimensions: string | null;
  material: string | null;
  stock: number;
  is_new_collection: boolean;
  badge: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  subtotal: number;
  shipping_fee: number;
  points_used: number;
  total: number;
  status: "confirmed" | "packed" | "shipped" | "delivered";
  courier: string | null;
  tracking_number: string | null;
  payment_method: string;
  address: {
    name: string; phone: string; street: string;
    district: string; province: string; postcode: string;
  };
  created_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  price: number;
  qty: number;
  image: string | null;
}

export interface PointsEntry {
  id: string;
  user_id: string;
  type: "earned" | "redeemed" | "bonus" | "referral" | "expired" | "adjusted";
  amount: number;
  description: string;
  order_id: string | null;
  created_at: string;
}

export interface PetShop {
  id: string;
  name: string;
  address: string;
  district: string | null;
  province: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  hours: string | null;
}

// ── PROFILES ────────────────────────────────────────────────────

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase().from("profiles").select("*").eq("id", userId).single();
  return data;
}

export async function updateProfile(userId: string, updates: Partial<Pick<Profile, "display_name" | "phone" | "lang">>) {
  await supabase().from("profiles").update(updates).eq("id", userId);
}

// ── PRODUCTS ────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const { data } = await supabase().from("products").select("*").eq("is_active", true).order("created_at", { ascending: false });
  return data ?? [];
}

export async function getProduct(id: string): Promise<Product | null> {
  const { data } = await supabase().from("products").select("*").eq("id", id).single();
  return data;
}

export async function createProduct(p: Omit<Product, "id" | "created_at">) {
  const { data, error } = await supabase().from("products").insert(p).select().single();
  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { error } = await supabase().from("products").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string) {
  await supabase().from("products").delete().eq("id", id);
}

// ── ORDERS ──────────────────────────────────────────────────────

export async function createOrder(
  order: Omit<Order, "id" | "created_at" | "order_items">,
  items: Omit<OrderItem, "id" | "order_id">[]
): Promise<string> {
  const { data, error } = await supabase().from("orders").insert(order).select().single();
  if (error) throw error;
  const orderId = (data as Order).id;
  await supabase().from("order_items").insert(items.map((i) => ({ ...i, order_id: orderId })));
  return orderId;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data } = await supabase()
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data as Order[]) ?? [];
}

export async function getAllOrders(): Promise<Order[]> {
  const { data } = await supabase()
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });
  return (data as Order[]) ?? [];
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  courier: string,
  trackingNumber: string
) {
  await supabase().from("orders").update({ status, courier, tracking_number: trackingNumber }).eq("id", orderId);
}

// ── POINTS ──────────────────────────────────────────────────────

export async function getUserPointsHistory(userId: string): Promise<PointsEntry[]> {
  const { data } = await supabase()
    .from("points_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function awardOrderPoints(userId: string, orderId: string, paidAmount: number, isFirstOrder: boolean) {
  const earned = Math.floor(paidAmount / 50);
  const bonus = isFirstOrder ? 10 : 0;

  await supabase().rpc("increment_points", { uid: userId, delta: earned + bonus });

  await supabase().from("points_history").insert([
    { user_id: userId, type: "earned", amount: earned, description: `Order #${orderId.slice(0, 8).toUpperCase()}`, order_id: orderId },
    ...(bonus > 0 ? [{ user_id: userId, type: "bonus", amount: bonus, description: "First Purchase Bonus", order_id: orderId }] : []),
  ]);
}

export async function adjustUserPoints(userId: string, amount: number, description: string) {
  await supabase().rpc("increment_points", { uid: userId, delta: amount });
  await supabase().from("points_history").insert({ user_id: userId, type: "adjusted", amount, description });
}

// ── PET SHOPS ────────────────────────────────────────────────────

export async function getPetShops(): Promise<PetShop[]> {
  const { data } = await supabase().from("pet_shops").select("*").order("name");
  return data ?? [];
}

export async function createPetShop(shop: Omit<PetShop, "id">) {
  const { data, error } = await supabase().from("pet_shops").insert(shop).select().single();
  if (error) throw error;
  return data as PetShop;
}

export async function updatePetShop(id: string, updates: Partial<PetShop>) {
  await supabase().from("pet_shops").update(updates).eq("id", id);
}

export async function deletePetShop(id: string) {
  await supabase().from("pet_shops").delete().eq("id", id);
}
