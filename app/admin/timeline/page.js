"use client";

import { useState, useEffect } from "react";
import {
  Compass,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  Upload,
  Sparkles,
  Check,
  X,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function AdminTimelinePage() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [order, setOrder] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMilestones = async () => {
    try {
      const res = await fetch("/api/milestones");
      if (res.ok) {
        const data = await res.json();
        setMilestones(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setDate("");
    setTitle("");
    setDescription("");
    setLocation("");
    setPhotoUrl("");
    setOrder(milestones.length + 1);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setDate(item.date);
    setTitle(item.title);
    setDescription(item.description);
    setLocation(item.location || "");
    setPhotoUrl(item.photoUrl || "");
    setOrder(item.order || 0);
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
      setError("Kesalahan saat mengunggah berkas.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !date || !description) {
      setError("Judul, tanggal, dan deskripsi momen wajib diisi.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = editingId ? `/api/milestones/${editingId}` : "/api/milestones";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          title,
          description,
          location,
          photoUrl: photoUrl || null,
          order: parseInt(order, 10) || 0,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(editingId ? "Momen berhasil diperbarui!" : "Momen linimasa berhasil ditambahkan!");
        setShowModal(false);
        fetchMilestones();
      } else {
        setError(data.error || "Gagal menyimpan momen.");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah kamu yakin ingin menghapus momen perjalanan ini?")) return;

    try {
      const res = await fetch(`/api/milestones/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMilestones((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      alert("Gagal menghapus momen.");
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
            Linimasa Perjalanan Cinta
          </h1>
          <p className="text-xs sm:text-sm text-burgundy/70 mt-1">
            Atur babak penting dalam hubungan, tanggal istimewa, cerita, dan lokasi bersejarah kalian.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-burgundy hover:bg-burgundy-dark text-ivory text-xs font-semibold tracking-wider transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4 text-mutedGold" />
          <span>Tambah Momen Baru</span>
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

      {/* Milestones List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-4 border-burgundy border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-burgundy/70 mt-2">Memuat linimasa kisah...</p>
        </div>
      ) : milestones.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dustyRose/20 shadow-sm">
          <Compass className="w-12 h-12 text-mutedGold mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-lg font-bold text-burgundy">Belum Ada Momen Linimasa</h3>
          <p className="text-xs text-burgundy/60 mt-1 mb-4">
            Catat momen pertama kali bertemu atau tanggal jadian kalian.
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
        <div className="space-y-4">
          {milestones.map((item, index) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-dustyRose/20 hover:border-dustyRose/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Photo Thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-softPink/30 shrink-0 border border-dustyRose/20">
                  {item.photoUrl ? (
                    <img
                      src={item.photoUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-mutedGold">
                      <Compass className="w-6 h-6 opacity-40" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-softPink text-[10px] font-semibold text-burgundy">
                      Urutan: #{item.order || index + 1}
                    </span>
                    <span className="text-xs font-semibold text-mutedGold-dark flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-mutedGold" />
                      {item.date}
                    </span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-bold text-burgundy">
                    {item.title}
                  </h3>

                  {item.location && (
                    <p className="text-xs text-burgundy/60 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-mutedGold" />
                      <span>{item.location}</span>
                    </p>
                  )}

                  <p className="text-xs text-burgundy/75 line-clamp-2 max-w-xl">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
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
                {editingId ? "Sunting Momen Linimasa" : "Tambah Momen Baru"}
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
              {/* Date & Order in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                    Tanggal Momen
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Contoh: 14 Februari 2023"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                    Urutan
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy font-mono"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                  Judul Babak Momen
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Hari Pertama Bertemu"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                  Lokasi (Opsional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Kedai Kopi Kenangan, Bandung"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                  Cerita &amp; Makna Momen
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ceritakan bagaimana momen indah tersebut terjadi..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy leading-relaxed"
                ></textarea>
              </div>

              {/* Photo Input (Upload or URL) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                  Foto Momen (Opsional)
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
                    placeholder="Atau tempel URL gambar (https://...)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
                  />
                </div>

                {photoUrl && (
                  <div className="mt-2 relative aspect-video rounded-xl overflow-hidden bg-neutral-100 border border-dustyRose/20">
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
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
                      <span>{editingId ? "Perbarui" : "Simpan Momen"}</span>
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
