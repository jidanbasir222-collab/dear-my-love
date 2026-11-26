"use client";

import { useState, useEffect } from "react";
import { Gift, Sparkles, Upload, Check, X, Award, PartyPopper } from "lucide-react";

export default function AdminSurprisePage() {
  const [boxTitle, setBoxTitle] = useState("");
  const [boxSubtitle, setBoxSubtitle] = useState("");
  const [message, setMessage] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [badge, setBadge] = useState("");
  const [couponText, setCouponText] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSurprise() {
      try {
        const res = await fetch("/api/surprise");
        if (res.ok) {
          const data = await res.json();
          setBoxTitle(data.boxTitle || "");
          setBoxSubtitle(data.boxSubtitle || "");
          setMessage(data.message || "");
          setPhotoUrl(data.photoUrl || "");
          setBadge(data.badge || "");
          setCouponText(data.couponText || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSurprise();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setPhotoUrl(data.url);
      } else {
        setError(data.error || "Gagal mengunggah foto.");
      }
    } catch (err) {
      setError("Kesalahan koneksi saat unggah foto.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/surprise", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boxTitle,
          boxSubtitle,
          message,
          photoUrl,
          badge,
          couponText,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Konten kejutan berhasil diperbarui dan disimpan!");
      } else {
        setError(data.error || "Gagal menyimpan kejutan.");
      }
    } catch (err) {
      setError("Kesalahan koneksi saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-8 h-8 border-4 border-burgundy border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-burgundy/70 mt-2">Memuat konten kejutan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <span className="text-xs uppercase tracking-widest text-mutedGold font-semibold">
          PENGELOLA KONTEN
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy mt-0.5">
          Kotak Kado &amp; Kejutan Kecil
        </h1>
        <p className="text-xs sm:text-sm text-burgundy/70 mt-1">
          Sesuaikan pesan rahasia, kupon cinta seumur hidup, dan foto istimewa yang muncul saat kotak kado dibuka.
        </p>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid: Editor & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Editor */}
        <form onSubmit={handleSubmit} className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-dustyRose/20 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-dustyRose/20 text-burgundy font-serif font-bold text-base">
            <Gift className="w-4 h-4 text-mutedGold" />
            <span>Pengaturan Kotak Kejutan</span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
              Judul Bagian Kejutan
            </label>
            <input
              type="text"
              value={boxTitle}
              onChange={(e) => setBoxTitle(e.target.value)}
              placeholder="Ada Satu Kejutan Kecil Untukmu..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
              Petunjuk Sentuh / Subjudul
            </label>
            <input
              type="text"
              value={boxSubtitle}
              onChange={(e) => setBoxSubtitle(e.target.value)}
              placeholder="Sentuh pita kado ini untuk membukanya"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
              Lencana Hadiah (Badge)
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Kado Cinta Abadi"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
              Pesan Kejutan Romantis
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tuliskan ucapan kejutanmu..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy leading-relaxed font-love text-base"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
              Teks Kupon Spesial
            </label>
            <textarea
              rows={3}
              value={couponText}
              onChange={(e) => setCouponText(e.target.value)}
              placeholder="Kupon Spesial: Berlaku selamanya untuk pelukan tanpa batas..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy leading-relaxed"
            ></textarea>
          </div>

          {/* Photo Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
              Foto Kejutan di Dalam Kado
            </label>
            <div className="space-y-2">
              <label className="cursor-pointer py-2 px-4 rounded-xl bg-softPink/30 hover:bg-softPink/60 text-burgundy text-xs font-semibold text-center border border-dashed border-dustyRose flex items-center justify-center gap-2 transition-colors">
                <Upload className="w-4 h-4 text-mutedGold" />
                <span>{uploading ? "Mengunggah berkas..." : "Unggah Foto dari Perangkat"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Atau tempel URL foto (https://...)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving || uploading}
              className="w-full py-3 rounded-xl bg-burgundy hover:bg-burgundy-dark text-ivory text-xs font-semibold tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Check className="w-4 h-4 text-mutedGold" />
              <span>{saving ? "Menyimpan..." : "Simpan Perubahan Kejutan"}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live Card Preview */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-burgundy/70">
            <Sparkles className="w-4 h-4 text-mutedGold" />
            <span>Pratinjau Kartu Kejutan Saat Terbuka</span>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-romantic border-2 border-mutedGold/40 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-dustyRose/20 mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-softPink text-burgundy text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-mutedGold" />
                <span>{badge || "Kado Cinta"}</span>
              </div>
              <div className="flex items-center gap-1 text-mutedGold text-xs font-semibold">
                <PartyPopper className="w-4 h-4" />
                <span>TERBUKA</span>
              </div>
            </div>

            {photoUrl && (
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-4 shadow-sm bg-softPink/20">
                <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="mb-4">
              <p className="font-love text-2xl text-burgundy leading-snug">
                "{message || "Pesan cintamu akan terpampang indah di sini..."}"
              </p>
            </div>

            {couponText && (
              <div className="p-3.5 rounded-xl bg-softPink/40 border border-dashed border-burgundy/40 text-burgundy text-xs font-semibold leading-relaxed">
                <p>{couponText}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
