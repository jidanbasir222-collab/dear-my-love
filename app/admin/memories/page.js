"use client";

import { useState, useEffect } from "react";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Calendar,
  Tag,
  Sparkles,
  Check,
  X,
} from "lucide-react";

export default function AdminMemoriesPage() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [category, setCategory] = useState("Momen Spesial");
  const [rotation, setRotation] = useState("0");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    "Kencan Pertama",
    "Liburan",
    "Momen Spesial",
    "Lucu / Random",
  ];

  const fetchMemories = async () => {
    try {
      const res = await fetch("/api/memories");
      if (res.ok) {
        const data = await res.json();
        setMemories(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setTitle("");
    setCaption("");
    setDate(new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }));
    setPhotoUrl("");
    setCategory("Momen Spesial");
    setRotation((Math.random() * 4 - 2).toFixed(1));
    setError("");
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCaption(item.caption || "");
    setDate(item.date);
    setPhotoUrl(item.photoUrl);
    setCategory(item.category || "Momen Spesial");
    setRotation(String(item.rotation || 0));
    setError("");
    setShowModal(true);
  };

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
    if (!title || !photoUrl || !date) {
      setError("Judul, foto, dan tanggal wajib diisi.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = editingId ? `/api/memories/${editingId}` : "/api/memories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          caption,
          date,
          photoUrl,
          category,
          rotation: parseFloat(rotation) || 0,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(editingId ? "Kenangan berhasil diperbarui!" : "Kenangan berhasil ditambahkan!");
        setShowModal(false);
        fetchMemories();
      } else {
        setError(data.error || "Gagal menyimpan kenangan.");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah kamu yakin ingin menghapus kenangan foto ini?")) return;

    try {
      const res = await fetch(`/api/memories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMemories((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      alert("Gagal menghapus foto.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-mutedGold font-semibold">
            PENGELOLA KONTEN
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy mt-0.5">
            Galeri Kenangan Polaroid
          </h1>
          <p className="text-xs sm:text-sm text-burgundy/70 mt-1">
            Tambah, edit keterangan, atur tanggal, dan hapus foto kenangan manis kalian berdua.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-burgundy hover:bg-burgundy-dark text-ivory text-xs font-semibold tracking-wider transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4 text-mutedGold" />
          <span>Tambah Kenangan Baru</span>
        </button>
      </div>

      {/* Success Notification */}
      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center justify-between">
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Grid of Existing Memories */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-4 border-burgundy border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-burgundy/70 mt-2">Memuat galeri foto...</p>
        </div>
      ) : memories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dustyRose/20 shadow-sm">
          <ImageIcon className="w-12 h-12 text-mutedGold mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-lg font-bold text-burgundy">Belum Ada Kenangan Foto</h3>
          <p className="text-xs text-burgundy/60 mt-1 mb-4">
            Mulai abadikan momen indah kalian dengan menambahkan foto kenangan pertama.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burgundy text-ivory text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-dustyRose/20 hover:border-dustyRose/50 transition-all flex flex-col justify-between"
            >
              {/* Photo */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-softPink/20 mb-3">
                <img
                  src={item.photoUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-burgundy text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                  <Tag className="w-2.5 h-2.5 text-mutedGold" />
                  {item.category}
                </span>
              </div>

              {/* Info */}
              <div className="mb-4">
                <h3 className="font-serif text-base font-bold text-burgundy truncate">
                  {item.title}
                </h3>
                {item.caption && (
                  <p className="font-love text-sm text-dustyRose-dark truncate mt-0.5">
                    "{item.caption}"
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-[11px] text-burgundy/60 mt-1 font-mono">
                  <Calendar className="w-3 h-3 text-mutedGold" />
                  <span>{item.date}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-dustyRose/15">
                <button
                  onClick={() => openEditModal(item)}
                  className="p-2 text-burgundy/70 hover:text-burgundy hover:bg-softPink/40 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Sunting</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Dialog for Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy-deep/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-dustyRose/40 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-dustyRose/20 mb-5">
              <h3 className="font-serif text-xl font-bold text-burgundy">
                {editingId ? "Sunting Kenangan" : "Tambah Kenangan Baru"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-burgundy/60 hover:text-burgundy rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo Input (Upload or URL) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                  Foto Kenangan
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer py-2.5 px-4 rounded-xl bg-softPink/30 hover:bg-softPink/60 text-burgundy text-xs font-semibold text-center border border-dashed border-dustyRose flex items-center justify-center gap-2 transition-colors">
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
                  </div>

                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Atau tempel URL gambar (https://...)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
                  />
                </div>

                {/* Photo Preview */}
                {photoUrl && (
                  <div className="mt-3 relative aspect-video rounded-xl overflow-hidden bg-neutral-100 border border-dustyRose/20">
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                  Judul Kenangan
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Kencan Pertama di Tepi Danau"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                  Keterangan Romantis (Caption Polaroid)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Contoh: Saat kamu tertawa melihat es krimku meleleh..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy font-love text-base"
                />
              </div>

              {/* Date & Category in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                    Tanggal
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="14 Feb 2023"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                    Kategori
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Polaroid Angle slider */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                  Sudut Kemiringan Polaroid ({rotation}°)
                </label>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={rotation}
                  onChange={(e) => setRotation(e.target.value)}
                  className="w-full h-1.5 bg-softPink rounded-lg appearance-none cursor-pointer accent-burgundy"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-dustyRose/20">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-burgundy/70 hover:bg-softPink/30"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-dark text-ivory text-xs font-semibold tracking-wider transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving ? (
                    <span>Menyimpan...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-mutedGold" />
                      <span>{editingId ? "Perbarui" : "Simpan Foto"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
