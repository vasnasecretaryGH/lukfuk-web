import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./config";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface UserDoc {
  displayName: string;
  email: string;
  phone: string;
  lang: "TH" | "EN";
  points: number;
  referralCode: string;
  referredBy?: string;
  createdAt: Timestamp | null;
}

export interface Product {
  id?: string;
  nameTh: string;
  nameEn: string;
  descTh: string;
  descEn: string;
  price: number;
  category: "house" | "scratcher" | "combo";
  images: string[];
  dimensions: string;
  material: string;
  stock: number;
  isNewCollection: boolean;
  badge: string | null;
  isActive: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

export interface Order {
  id?: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  pointsUsed: number;
  total: number;
  status: "confirmed" | "packed" | "shipped" | "delivered";
  courier: string;
  trackingNumber: string;
  address: {
    name: string;
    phone: string;
    street: string;
    district: string;
    province: string;
    postcode: string;
  };
  paymentMethod: "promptpay" | "card" | "truemoney";
  createdAt: Timestamp | null;
}

export interface PointsEntry {
  id?: string;
  userId: string;
  type: "earned" | "redeemed" | "bonus" | "referral" | "expired" | "adjusted";
  amount: number;
  description: string;
  orderId?: string;
  createdAt: Timestamp | null;
}

export interface PetShop {
  id?: string;
  name: string;
  address: string;
  district: string;
  province: string;
  lat: number;
  lng: number;
  phone: string;
  hours: string;
}

// ─────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────

function generateReferralCode(uid: string): string {
  return "LF-" + uid.slice(0, 6).toUpperCase();
}

export async function createUserDoc(
  uid: string,
  data: Pick<UserDoc, "displayName" | "email" | "phone" | "lang">
): Promise<void> {
  await setDoc(doc(db, "users", uid), {
    ...data,
    points: 0,
    referralCode: generateReferralCode(uid),
    createdAt: serverTimestamp(),
  });
}

export async function getUserDoc(uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserDoc) : null;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserDoc, "displayName" | "phone" | "lang">>
): Promise<void> {
  await updateDoc(doc(db, "users", uid), data);
}

// ─────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const snap = await getDocs(
    query(collection(db, "products"), where("isActive", "==", true))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getProduct(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, "products", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Product) : null;
}

export async function createProduct(data: Omit<Product, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "products"), data);
  return ref.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, "products", id), data);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, "products", id));
}

export async function decrementStock(id: string, qty: number): Promise<void> {
  await updateDoc(doc(db, "products", id), { stock: increment(-qty) });
}

// ─────────────────────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────────────────────

export async function createOrder(data: Omit<Order, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "orders"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const snap = await getDocs(
    query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function getAllOrders(): Promise<Order[]> {
  const snap = await getDocs(
    query(collection(db, "orders"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  courier: string,
  trackingNumber: string
): Promise<void> {
  await updateDoc(doc(db, "orders", orderId), { status, courier, trackingNumber });
}

// ─────────────────────────────────────────────────────────────
// POINTS
// ─────────────────────────────────────────────────────────────

export async function addPointsEntry(data: Omit<PointsEntry, "id">): Promise<void> {
  await addDoc(collection(db, "pointsHistory"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getUserPointsHistory(userId: string): Promise<PointsEntry[]> {
  const snap = await getDocs(
    query(
      collection(db, "pointsHistory"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PointsEntry));
}

export async function adjustUserPoints(
  uid: string,
  amount: number,
  description: string
): Promise<void> {
  await updateDoc(doc(db, "users", uid), { points: increment(amount) });
  await addPointsEntry({
    userId: uid,
    type: "adjusted",
    amount,
    description,
    createdAt: null,
  });
}

/** Called when an order is marked "delivered" — awards earned points */
export async function awardOrderPoints(
  uid: string,
  orderId: string,
  paidAmount: number,
  isFirstOrder: boolean
): Promise<void> {
  const earned = Math.floor(paidAmount / 50);
  const bonus = isFirstOrder ? 10 : 0;
  const total = earned + bonus;

  await updateDoc(doc(db, "users", uid), { points: increment(total) });

  await addPointsEntry({
    userId: uid,
    type: "earned",
    amount: earned,
    description: `Order #${orderId}`,
    orderId,
    createdAt: null,
  });

  if (bonus > 0) {
    await addPointsEntry({
      userId: uid,
      type: "bonus",
      amount: bonus,
      description: "First Purchase Bonus",
      orderId,
      createdAt: null,
    });
  }
}

/** Award referral points to referrer */
export async function awardReferralPoints(referrerUid: string, refereeUid: string): Promise<void> {
  await updateDoc(doc(db, "users", referrerUid), { points: increment(5) });
  await addPointsEntry({
    userId: referrerUid,
    type: "referral",
    amount: 5,
    description: `Referral bonus`,
    createdAt: null,
  });
}

// ─────────────────────────────────────────────────────────────
// PET SHOPS
// ─────────────────────────────────────────────────────────────

export async function getPetShops(): Promise<PetShop[]> {
  const snap = await getDocs(collection(db, "petShops"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PetShop));
}

export async function createPetShop(data: Omit<PetShop, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "petShops"), data);
  return ref.id;
}

export async function updatePetShop(id: string, data: Partial<PetShop>): Promise<void> {
  await updateDoc(doc(db, "petShops", id), data);
}

export async function deletePetShop(id: string): Promise<void> {
  await deleteDoc(doc(db, "petShops", id));
}
