import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "./client";

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName: string,
  lang: string
) {
  const { data, error } = await supabase().auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName, lang } },
  });
  if (error) throw error;
  return data.user;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase().auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signInWithOtp(phone: string) {
  const { error } = await supabase().auth.signInWithOtp({ phone });
  if (error) throw error;
}

export async function verifyOtp(phone: string, token: string) {
  const { data, error } = await supabase().auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
  if (error) throw error;
  return data.user;
}

export async function signOut() {
  await supabase().auth.signOut();
}

export function onAuthChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  return supabase().auth.onAuthStateChange(callback).data.subscription;
}
