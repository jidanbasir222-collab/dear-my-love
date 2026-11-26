"use client";

import { useState, useEffect } from "react";
import { Mail, Feather, Check, Sparkles, X, Eye } from "lucide-react";

export default function AdminLetterPage() {
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [signature, setSignature] = useState("");
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLetter() {
      try {
        const res = await fetch("/api/letter");
        if (res.ok) {
          const data = await res.json();
          setRecipient(data.recipient || "");
          setTitle(data.title || "");
          setContent(data.content || "");
          setSignature(data.signature || "");
          setDate(data.date || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLetter();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/letter", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient,
          title,
          content,
          signature,
          date,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Surat cinta berhasil diperbarui dan disimpan!");
      } else {
        setError(data.error || "Gagal menyimpan surat cinta.");
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
        <p className="text-xs text-burgundy/70 mt-2">Memuat surat cinta...</p>
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
          Surat Cinta Digital
        </h1>
        <p className="text-xs sm:text-sm text-burgundy/70 mt-1">
          Tuliskan kata-kata paling tulus dan romantis yang akan muncul saat amplop digital dibuka.
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

      {/* Grid: Editor & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Editor */}
        <form onSubmit={handleSubmit} className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-dustyRose/20 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-dustyRose/20 text-burgundy font-serif font-bold text-base">
            <Feather className="w-4 h-4 text-mutedGold" />
            <span>Formulir Penulisan Surat</span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
              Penerima Surat (Nama Panggilan Sayang)
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Untuk zaskia nisa syabani, Bidadari Semestaku"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                Judul Surat
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sebuah Surat Dari Lubuk Hatiku"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                Tanggal Surat
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="22 November"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
              Isi Surat Cinta (Gunakan enter ganda untuk paragraf baru)
            </label>
            <textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan ungkapan perasaanmu di sini..."
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy leading-relaxed"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
              Tanda Tangan / Nama Pengirim
            </label>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Dengan segenap cintaku, ahmad zaidan ❤️"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy font-love text-base"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-burgundy hover:bg-burgundy-dark text-ivory text-xs font-semibold tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Check className="w-4 h-4 text-mutedGold" />
              <span>{saving ? "Menyimpan Surat..." : "Simpan Perubahan Surat"}</span>
            </button>
          </div>
        </form>

        {/* Right Column: Live Parchment Paper Preview */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-burgundy/70">
            <Eye className="w-4 h-4 text-mutedGold" />
            <span>Pratinjau Nyata di Kertas Surat</span>
          </div>

          <div className="parchment-texture rounded-3xl p-6 sm:p-10 shadow-letter border border-dustyRose/40 text-left">
            <div className="flex items-center justify-between border-b border-dustyRose/20 pb-3 mb-5">
              <span className="font-serif text-[11px] uppercase tracking-widest text-mutedGold font-semibold">
                {title || "SURAT CINTA"}
              </span>
              <span className="text-[11px] font-mono text-burgundy/60">{date}</span>
            </div>

            <h3 className="font-love text-2xl sm:text-3xl text-burgundy font-bold mb-4">
              {recipient || "Sayangku"},
            </h3>

            <div className="space-y-3 font-sans text-xs sm:text-sm text-burgundy/90 leading-relaxed">
              {(content || "Isi surat akan tampil di sini...")
                .split("\n\n")
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
            </div>

            <div className="mt-8 pt-4 border-t border-dustyRose/20 text-right">
              <p className="font-love text-2xl sm:text-3xl text-burgundy font-bold">
                {signature || "ahmad zaidan"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
