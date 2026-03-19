import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "./config";
import { createUserDoc } from "./firestore";

// ── Phone OTP ──────────────────────────────────────────────

export function setupRecaptcha(containerId: string): RecaptchaVerifier {
  return new RecaptchaVerifier(auth, containerId, { size: "invisible" });
}

export async function sendOtp(
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  // phoneNumber must be in E.164 format e.g. +66812345678
  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
}

export async function verifyOtp(
  confirmationResult: ConfirmationResult,
  otp: string
): Promise<User> {
  const result = await confirmationResult.confirm(otp);
  return result.user;
}

// ── Email / Password ───────────────────────────────────────

export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
  lang: string
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  await createUserDoc(cred.user.uid, { displayName, email, lang, phone: "" });
  return cred.user;
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

// ── Shared ─────────────────────────────────────────────────

export async function logout(): Promise<void> {
  await signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
