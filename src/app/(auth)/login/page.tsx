"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("E-mail ou senha inválidos. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-24 h-24 mb-4">
          <Image
            src="/logo.webp"
            alt="LCR GAMERS"
            fill
            className="object-contain drop-shadow-[0_0_24px_rgba(0,230,230,0.5)]"
            priority
          />
        </div>
        <h1
          className="font-bold text-2xl text-[#00e6e6] tracking-widest text-center"
          style={{ fontFamily: "'Orbitron', monospace" }}
        >
          LCR GAMERS
        </h1>
        <p className="text-[#666666] text-sm mt-1">Collection Vault</p>
      </div>

      {/* Card */}
      <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-6 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
        <h2 className="text-[#e0e0e0] font-semibold text-lg mb-0.5">Acesso Restrito</h2>
        <p className="text-[#555555] text-sm mb-6">Apenas membros LCR GAMERS</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#888888] uppercase tracking-wider">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="seu@email.com"
              className="w-full bg-[#0a0a0a] border border-[#222222] text-[#e0e0e0] rounded-xl px-4 py-3 text-sm placeholder:text-[#3a3a3a] transition-all duration-200 focus:outline-none focus:border-[#00e6e6] focus:shadow-[0_0_0_1px_#00e6e6,0_0_12px_rgba(0,230,230,0.15)] disabled:opacity-50"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#888888] uppercase tracking-wider">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0a] border border-[#222222] text-[#e0e0e0] rounded-xl px-4 py-3 pr-11 text-sm placeholder:text-[#3a3a3a] transition-all duration-200 focus:outline-none focus:border-[#00e6e6] focus:shadow-[0_0_0_1px_#00e6e6,0_0_12px_rgba(0,230,230,0.15)] disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#555555] hover:text-[#00e6e6] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-[#ff1a75]/10 border border-[#ff1a75]/30 rounded-xl px-4 py-3">
              <p className="text-[#ff1a75] text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            style={{
              background: loading
                ? "#1a1a1a"
                : "linear-gradient(135deg, #00e6e6, #ff1a75)",
              color: loading ? "#555555" : "#0a0a0a",
              boxShadow: loading ? "none" : "0 0 24px rgba(0, 230, 230, 0.25)",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Entrar
              </>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-[#2a2a2a] text-xs mt-6">
        © 2025 LCR GAMERS · Collection Vault
      </p>
    </div>
  );
}
