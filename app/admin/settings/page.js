"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Sparkles,
  Heart,
  Upload,
  Check,
  X,
  Lock,
  KeyRound,
  Calendar,
  Save,
} from "lucide-react";

export default function AdminSettingsPage() {
  // General Site Settings
  const [coupleName1, setCoupleName1] = useState("");
  const [coupleName2, setCoupleName2] = useState("");
  const [anniversaryDate, setAnniversaryDate] = useState("");
  const [websiteTitle, setWebsiteTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [heroPhoto, setHeroPhoto] = useState("");
  const [finalPhoto, setFinalPhoto] = useState("");
  const [finalMessage, setFinalMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingFinal, setUploadingFinal] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [settingsError, setSettingsError] = useState("");

  // Password Change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setCoupleName1(data.coupleName1 || "");
          setCoupleName2(data.coupleName2 || "");
          setAnniversaryDate(data.anniversaryDate || "2023-11-22T00:00:00");
          setWebsiteTitle(data.websiteTitle || "OUR LITTLE UNIVERSE");
          setTagline(data.tagline || "");
          setHeroPhoto(data.heroPhoto || "");
          setFinalPhoto(data.finalPhoto || "");
          setFinalMessage(data.finalMessage || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleHeroUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingHero(true);
    setSettingsError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setHeroPhoto(data.url);
      } else {
        setSettingsError(data.error || "Gagal mengunggah foto beranda.");
      }
    } catch (err) {
      setSettingsError("Kesalahan saat unggah berkas.");
    } finally {
      setUploadingHero(false);
    }
  };

  const handleFinalUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFinal(true);
    setSettingsError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setFinalPhoto(data.url);
      } else {
        setSettingsError(data.error || "Gagal mengunggah foto penutup.");
      }
    } catch (err) {
      setSettingsError("Kesalahan saat unggah berkas.");
    } finally {
      setUploadingFinal(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsError("");
    setSettingsSuccess("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupleName1,
          coupleName2,
          anniversaryDate,
          websiteTitle,
          tagline,
          heroPhoto,
          finalPhoto,
          finalMessage,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSettingsSuccess("Pengaturan website berhasil disimpan!");
      } else {
        setSettingsError(data.error || "Gagal menyimpan pengaturan.");
      }
    } catch (err) {
      setSettingsError("Terjadi kesalahan jaringan.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Kata sandi baru minimal 6 karakter.");
      return;
    }

    setSavingPassword(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordSuccess("Kata sandi admin berhasil diperbarui!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(data.error || "Gagal mengubah kata sandi.");
      }
    } catch (err) {
      setPasswordError("Terjadi kesalahan koneksi.");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-4 border-burgundy border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-burgundy/70 mt-2">Memuat pengaturan website...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Page Title */}
      <div>
        <span className="text-xs uppercase tracking-widest text-mutedGold font-semibold">
          KONFIGURASI SISTEM
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy mt-0.5">
          Pengaturan Website &amp; Personalisasi
        </h1>
        <p className="text-xs sm:text-sm text-burgundy/70 mt-1">
          Sesuaikan nama pasangan, tanggal hari jadi, foto utama, kutipan penutup, dan keamanan akun.
        </p>
      </div>

      {/* Main Settings Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-dustyRose/20 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-dustyRose/20 text-burgundy font-serif font-bold text-lg">
          <Heart className="w-5 h-5 text-dustyRose fill-dustyRose" />
          <span>Informasi Pasangan &amp; Konten Utama</span>
        </div>

        {settingsSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center justify-between">
            <span>{settingsSuccess}</span>
            <button onClick={() => setSettingsSuccess("")} className="text-emerald-500 hover:text-emerald-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {settingsError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium flex items-center justify-between">
            <span>{settingsError}</span>
            <button onClick={() => setSettingsError("")} className="text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Couple Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                Nama Pasangan 1 (Contoh: Namamu)
              </label>
              <input
                type="text"
                value={coupleName1}
                onChange={(e) => setCoupleName1(e.target.value)}
                placeholder="ahmad zaidan"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                Nama Pasangan 2 (Contoh: Nama Pacarmu)
              </label>
              <input
                type="text"
                value={coupleName2}
                onChange={(e) => setCoupleName2(e.target.value)}
                placeholder="zaskia nisa syabani"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy font-medium"
              />
            </div>
          </div>

          {/* Anniversary Date & Website Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                Tanggal &amp; Waktu Hari Jadi (Acuan Hitungan Cinta)
              </label>
              <input
                type="text"
                value={anniversaryDate}
                onChange={(e) => setAnniversaryDate(e.target.value)}
                placeholder="2023-11-22T00:00:00"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy font-mono"
              />
              <p className="text-[10px] text-burgundy/60 mt-1">
                Format: YYYY-MM-DDTHH:MM:SS (contoh: 2023-11-22T00:00:00)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                Judul Website
              </label>
              <input
                type="text"
                value={websiteTitle}
                onChange={(e) => setWebsiteTitle(e.target.value)}
                placeholder="OUR LITTLE UNIVERSE"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy font-serif font-bold"
              />
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
              Slogan / Tagline Romantis
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Every love story has a universe. This one is ours."
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy font-love text-base"
            />
          </div>

          {/* Photos: Hero Photo & Final Photo in 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Hero Photo */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy">
                Foto Utama Beranda (Hero Photo)
              </label>
              <label className="cursor-pointer py-2 px-4 rounded-xl bg-softPink/30 hover:bg-softPink/60 text-burgundy text-xs font-semibold text-center border border-dashed border-dustyRose flex items-center justify-center gap-2 transition-colors">
                <Upload className="w-4 h-4 text-mutedGold" />
                <span>{uploadingHero ? "Mengunggah..." : "Unggah Foto Hero"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleHeroUpload}
                  className="hidden"
                  disabled={uploadingHero}
                />
              </label>
              <input
                type="text"
                value={heroPhoto}
                onChange={(e) => setHeroPhoto(e.target.value)}
                placeholder="Atau tautan foto hero..."
                className="w-full px-3 py-2 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
              />
              {heroPhoto && (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 border border-dustyRose/20">
                  <img src={heroPhoto} alt="Hero Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Final Photo */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy">
                Foto Bagian Penutup (Final Photo)
              </label>
              <label className="cursor-pointer py-2 px-4 rounded-xl bg-softPink/30 hover:bg-softPink/60 text-burgundy text-xs font-semibold text-center border border-dashed border-dustyRose flex items-center justify-center gap-2 transition-colors">
                <Upload className="w-4 h-4 text-mutedGold" />
                <span>{uploadingFinal ? "Mengunggah..." : "Unggah Foto Penutup"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFinalUpload}
                  className="hidden"
                  disabled={uploadingFinal}
                />
              </label>
              <input
                type="text"
                value={finalPhoto}
                onChange={(e) => setFinalPhoto(e.target.value)}
                placeholder="Atau tautan foto penutup..."
                className="w-full px-3 py-2 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
              />
              {finalPhoto && (
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 border border-dustyRose/20">
                  <img src={finalPhoto} alt="Final Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Final Message */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
              Pesan Cinta Terakhir (Closing Message)
            </label>
            <textarea
              rows={4}
              value={finalMessage}
              onChange={(e) => setFinalMessage(e.target.value)}
              placeholder="Terima kasih telah menjadi bagian terindah dalam setiap hariku..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy leading-relaxed italic"
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              disabled={savingSettings || uploadingHero || uploadingFinal}
              className="px-6 py-3 rounded-xl bg-burgundy hover:bg-burgundy-dark text-ivory text-xs font-semibold tracking-wider transition-all shadow-md flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4 text-mutedGold" />
              <span>{savingSettings ? "Menyimpan Pengaturan..." : "Simpan Seluruh Pengaturan"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Password Security Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-dustyRose/20 space-y-6">
        <div className="flex items-center gap-2 pb-3 border-b border-dustyRose/20 text-burgundy font-serif font-bold text-lg">
          <KeyRound className="w-5 h-5 text-mutedGold" />
          <span>Keamanan &amp; Kata Sandi Admin</span>
        </div>

        {passwordSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center justify-between">
            <span>{passwordSuccess}</span>
            <button onClick={() => setPasswordSuccess("")} className="text-emerald-500 hover:text-emerald-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {passwordError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium flex items-center justify-between">
            <span>{passwordError}</span>
            <button onClick={() => setPasswordError("")} className="text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
              Kata Sandi Saat Ini
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
              Kata Sandi Baru (Min. 6 Karakter)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
              Konfirmasi Kata Sandi Baru
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-6 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy-dark text-ivory text-xs font-semibold tracking-wider transition-all shadow-md flex items-center gap-2 disabled:opacity-60"
            >
              <Lock className="w-4 h-4 text-mutedGold" />
              <span>{savingPassword ? "Memperbarui Sandi..." : "Ubah Kata Sandi"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
