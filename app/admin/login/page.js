"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Sparkles, Heart, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal masuk. Periksa kembali username dan kata sandi.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-softPink/50 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl p-8 sm:p-10 shadow-romantic border border-dustyRose/30 max-w-md w-full relative"
      >
        {/* Back to Home Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-burgundy/60 hover:text-burgundy mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Website</span>
        </Link>

        {/* Lock Emblem Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-softPink flex items-center justify-center mx-auto mb-3 shadow-sm border border-dustyRose/30 text-burgundy">
            <Lock className="w-7 h-7 text-mutedGold" />
          </div>
          <span className="text-[11px] uppercase tracking-widest text-mutedGold font-semibold">
            OUR LITTLE UNIVERSE
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy mt-1">
            Ruang Pengaturan
          </h1>
          <p className="text-xs text-burgundy/70 mt-1">
            Masuk untuk memperbarui cerita cinta, foto, dan musik.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              required
              className="w-full px-4 py-3 rounded-xl bg-ivory border border-dustyRose/40 focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-sm text-burgundy transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl bg-ivory border border-dustyRose/40 focus:border-burgundy focus:ring-1 focus:ring-burgundy outline-none text-sm text-burgundy transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-burgundy/50 hover:text-burgundy transition-colors"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-burgundy hover:bg-burgundy-dark text-ivory text-sm font-semibold tracking-wider transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-ivory border-t-transparent rounded-full animate-spin"></div>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-mutedGold" />
                  <span>Buka Akses Admin</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center border-t border-dustyRose/20 pt-4">
          <p className="text-[11px] text-burgundy/60">
            Kredensial bawaan: <span className="font-mono font-semibold text-burgundy">admin</span> / <span className="font-mono font-semibold text-burgundy">admin123</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
