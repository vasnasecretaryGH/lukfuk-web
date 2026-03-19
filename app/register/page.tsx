"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Phone, Mail } from "lucide-react";
import { signInWithOtp, verifyOtp, signUpWithEmail } from "@/lib/supabase/auth";

type Method = "phone" | "email";
type Step = "input" | "otp" | "profile";

export default function RegisterPage() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>("phone");
  const [step, setStep] = useState<Step>("input");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lang, setLang] = useState<"TH" | "EN">("TH");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
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
      setStep("profile");
    } catch {
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    if (!name) { setError("Please enter your display name."); return; }
    setError("");
    setLoading(true);
    try {
      if (method === "email") {
        await signUpWithEmail(email, password, name, lang);
      }
      // Phone users: profile auto-created by DB trigger on OTP verify
      // Update display_name via supabase auth metadata on next login
      router.push("/");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const steps: Step[] = method === "phone" ? ["input", "otp", "profile"] : ["input", "profile"];
  const stepIndex = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blush/60 to-mint flex-col items-center justify-center p-16 text-center">
        <p className="font-display text-5xl font-bold text-charcoal mb-4 leading-tight">
          Join the Lukfuk family 🐾
        </p>
        <p className="text-charcoal/50 text-lg max-w-sm">
          Earn points on every purchase, get exclusive member deals, and find stores near you.
        </p>
        <div className="mt-10 flex flex-col gap-3 w-full max-w-xs">
          {["Earn 10 bonus pts on first order", "Refer friends for bonus points", "Shop direct — no platform fees"].map((b) => (
            <div key={b} className="flex items-center gap-3 bg-cream/60 rounded-2xl px-4 py-3 text-left">
              <span className="text-sage text-lg">✓</span>
              <span className="text-sm text-charcoal/70">{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Link href="/" className="font-display text-2xl font-semibold text-charcoal block mb-10">
            Lukfuk.BKK
          </Link>

          <h1 className="font-display text-3xl font-bold text-charcoal mb-1">Create account</h1>
          <p className="text-charcoal/50 text-sm mb-8">
            Already have an account?{" "}
            <Link href="/login" className="text-sage hover:text-sage-dark transition-colors font-medium">Sign in</Link>
          </p>

          {error && (
            <div className="bg-blush/40 text-charcoal text-sm rounded-2xl px-4 py-3 mb-5">{error}</div>
          )}

          {/* Step 1: credentials */}
          {step === "input" && (
            <>
              <div className="flex bg-mint/30 rounded-full p-1 mb-8">
                {(["phone", "email"] as Method[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMethod(m); setError(""); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${method === m ? "bg-charcoal text-cream shadow-sm" : "text-charcoal/50 hover:text-charcoal"}`}
                  >
                    {m === "phone" ? <Phone size={14} /> : <Mail size={14} />}
                    {m === "phone" ? "Phone Number" : "Email"}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {method === "phone" ? (
                  <div>
                    <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Phone Number</label>
                    <div className="flex gap-2 mt-1">
                      <span className="bg-mint/30 rounded-2xl px-4 py-3 text-sm text-charcoal/60 shrink-0">+66</span>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                        placeholder="08X-XXX-XXXX"
                        className="flex-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Email</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Password <span className="normal-case">(min. 8 characters)</span></label>
                      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40" />
                    </div>
                  </>
                )}
                <button
                  onClick={method === "phone" ? handleSendOtp : () => setStep("profile")}
                  disabled={loading || (method === "phone" ? phone.length < 9 : !email || password.length < 8)}
                  className="w-full bg-charcoal text-cream py-4 rounded-full font-medium hover:bg-charcoal/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Please wait…" : <>Continue <ArrowRight size={16} /></>}
                </button>
              </div>
            </>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <div className="space-y-6">
              <p className="text-sm text-charcoal/60">
                Enter the 6-digit code sent to <span className="font-medium text-charcoal">+66 {phone}</span>
              </p>
              <div className="flex gap-2 justify-between">
                {otp.map((d, i) => (
                  <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-bold bg-mint/20 rounded-2xl text-charcoal focus:outline-none focus:ring-2 focus:ring-sage/40" />
                ))}
              </div>
              <button onClick={handleVerifyOtp} disabled={loading || otp.join("").length < 6}
                className="w-full bg-charcoal text-cream py-4 rounded-full font-medium hover:bg-charcoal/80 transition-colors disabled:opacity-50">
                {loading ? "Verifying…" : "Verify Code"}
              </button>
              <button onClick={() => setStep("input")} className="w-full text-sm text-charcoal/50 hover:text-charcoal transition-colors">← Change number</button>
            </div>
          )}

          {/* Step 3: Profile */}
          {step === "profile" && (
            <div className="space-y-4">
              <div className="bg-mint/20 rounded-2xl px-4 py-3 text-sm text-sage font-medium text-center">
                ✓ {method === "phone" ? "Phone verified!" : "Almost there!"} Set up your profile
              </div>
              <div>
                <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Display Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="What should we call you?"
                  className="w-full mt-1 bg-mint/20 rounded-2xl px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40" />
              </div>
              <div>
                <label className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Preferred Language</label>
                <div className="flex gap-3 mt-2">
                  {(["TH", "EN"] as const).map((l) => (
                    <button key={l} onClick={() => setLang(l)}
                      className={`flex-1 py-3 rounded-2xl text-sm font-medium transition-all border-2 ${lang === l ? "border-charcoal bg-charcoal text-cream" : "border-sage/20 text-charcoal/60 hover:border-sage/50"}`}>
                      {l === "TH" ? "ภาษาไทย" : "English"}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleCreateProfile} disabled={loading || !name}
                className="w-full bg-charcoal text-cream py-4 rounded-full font-medium hover:bg-charcoal/80 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? "Creating account…" : <>Create Account <ArrowRight size={16} /></>}
              </button>
            </div>
          )}

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-10">
            {steps.map((s) => (
              <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${steps.indexOf(s) <= stepIndex ? "w-6 bg-charcoal" : "w-1.5 bg-charcoal/20"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
