"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { signInWithOtp, verifyOtp, signInWithEmail } from "@/lib/supabase/auth";

type Method = "phone" | "email";
type Step = "input" | "otp";

export default function LoginPage() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>("phone");
  const [step, setStep] = useState<Step>("input");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  const handleSendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const e164 = "+66" + phone.replace(/^0/, "").replace(/-/g, "");
      await signInWithOtp(e164);
      setStep("otp");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const e164 = "+66" + phone.replace(/^0/, "").replace(/-/g, "");
      await verifyOtp(e164, otp.join(""));
      router.push("/");
    } catch {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.push("/");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-mint to-sage/50 flex-col items-center justify-center p-16 text-center">
        <p className="font-display text-5xl font-bold text-charcoal mb-4 leading-tight">
          Welcome back, cat parent 🐱
        </p>
        <p className="text-charcoal/50 text-lg max-w-sm">
          Sign in to access your orders, points, and exclusive member benefits.
        </p>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Link href="/" className="font-display text-2xl font-semibold text-charcoal block mb-10">
            Lukfuk.BKK
          </Link>

          <h1 className="font-display text-3xl font-bold text-charcoal mb-1">Sign in</h1>
          <p className="text-charcoal/50 text-sm mb-8">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-sage hover:text-sage-dark transition-colors font-medium">
              Register
            </Link>
          </p>

          {error && (
            <div className="bg-blush/40 text-charcoal text-sm rounded-2xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          {/* Method toggle */}
          <div className="flex bg-mint/30 rounded-full p-1 mb-8">
            {(["phone", "email"] as Method[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMethod(m); setStep("input"); setError(""); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${method === m ? "bg-charcoal text-cream shadow-sm" : "text-charcoal/50 hover:text-charcoal"}`}
              >
                {m === "phone" ? <Phone size={14} /> : <Mail size={14} />}
                {m === "phone" ? "Phone Number" : "Email"}
              </button>
            ))}
          </div>

          {/* Phone flow */}
          {method === "phone" && (
            <>
              {step === "input" ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Phone Number</label>
                    <div className="flex gap-2 mt-1">
                      <span className="bg-mint/30 rounded-2xl px-4 py-3 text-sm text-charcoal/60 shrink-0">+66</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="08X-XXX-XXXX"
                        className="flex-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSendOtp}
                    disabled={loading || phone.length < 9}
                    className="w-full bg-charcoal text-cream py-4 rounded-full font-medium hover:bg-charcoal/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? "Sending…" : <>Send OTP <ArrowRight size={16} /></>}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-charcoal/60 mb-1">
                      Enter the 6-digit code sent to <span className="font-medium text-charcoal">+66 {phone}</span>
                    </p>
                    <p className="text-xs text-charcoal/40">Code expires in 5 minutes</p>
                  </div>
                  <div className="flex gap-2 justify-between">
                    {otp.map((d, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        className="w-12 h-14 text-center text-xl font-bold bg-mint/20 rounded-2xl text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40"
                      />
                    ))}
                  </div>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.join("").length < 6}
                    className="w-full bg-charcoal text-cream py-4 rounded-full font-medium hover:bg-charcoal/80 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Verifying…" : "Verify & Sign In"}
                  </button>
                  <button onClick={() => setStep("input")} className="w-full text-sm text-charcoal/50 hover:text-charcoal transition-colors">
                    ← Change number
                  </button>
                </div>
              )}
            </>
          )}

          {/* Email flow */}
          {method === "email" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40"
                />
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Password</label>
                  <Link href="#" className="text-xs text-sage hover:text-sage-dark transition-colors">Forgot password?</Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40"
                />
              </div>
              <button
                onClick={handleEmailLogin}
                disabled={loading || !email || !password}
                className="w-full bg-charcoal text-cream py-4 rounded-full font-medium hover:bg-charcoal/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? "Signing in…" : <>Sign In <ArrowRight size={16} /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
