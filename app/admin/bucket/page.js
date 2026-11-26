"use client";

import { useState, useEffect } from "react";
import {
  CheckSquare,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  Tag,
  Check,
  X,
  Plane,
  Utensils,
  Smile,
  Home,
  Sparkles,
} from "lucide-react";

export default function AdminBucketPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Travel");
  const [note, setNote] = useState("");
  const [completed, setCompleted] = useState(false);
  const [completedDate, setCompletedDate] = useState("");
  const [order, setOrder] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = ["Travel", "Kencan", "Pengalaman", "Mimpi Bersama"];

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/bucket");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setTitle("");
    setCategory("Travel");
    setNote("");
    setCompleted(false);
    setCompletedDate("");
    setOrder(items.length + 1);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setNote(item.note || "");
    setCompleted(item.completed);
    setCompletedDate(item.completedDate || "");
    setOrder(item.order || 0);
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      setError("Judul impian wajib diisi.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = editingId ? `/api/bucket/${editingId}` : "/api/bucket";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          note,
          completed,
          completedDate: completed ? completedDate || new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : null,
          order: parseInt(order, 10) || 0,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(editingId ? "Impian berhasil diperbarui!" : "Impian baru berhasil ditambahkan!");
        setShowModal(false);
        fetchItems();
      } else {
        setError(data.error || "Gagal menyimpan impian.");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (item) => {
    const newStatus = !item.completed;
    const nowStr = newStatus
      ? new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id ? { ...i, completed: newStatus, completedDate: nowStr } : i
      )
    );

    try {
      await fetch(`/api/bucket/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: newStatus,
          completedDate: nowStr,
        }),
      });
    } catch (err) {
      fetchItems();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah kamu yakin ingin menghapus impian ini?")) return;

    try {
      const res = await fetch(`/api/bucket/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err) {
      alert("Gagal menghapus impian.");
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "Travel":
        return <Plane className="w-3.5 h-3.5 text-mutedGold" />;
      case "Kencan":
        return <Utensils className="w-3.5 h-3.5 text-mutedGold" />;
      case "Pengalaman":
        return <Smile className="w-3.5 h-3.5 text-mutedGold" />;
      case "Mimpi Bersama":
        return <Home className="w-3.5 h-3.5 text-mutedGold" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-mutedGold" />;
    }
  };

  const completedCount = items.filter((i) => i.completed).length;
  const percentage = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-mutedGold font-semibold">
            PENGELOLA KONTEN
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy mt-0.5">
            Impian &amp; Masa Depan Kita (Bucket List)
          </h1>
          <p className="text-xs sm:text-sm text-burgundy/70 mt-1">
            Catat mimpi-mimpi yang ingin diwujudkan bersama dan tandai yang sudah tercapai.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-burgundy hover:bg-burgundy-dark text-ivory text-xs font-semibold tracking-wider transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4 text-mutedGold" />
          <span>Tambah Impian Baru</span>
        </button>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-dustyRose/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-burgundy/70">Kemajuan Rencana Bersama</span>
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-burgundy">
              {completedCount} dari {items.length} Terwujud
            </span>
            <span className="text-sm font-mono font-bold text-mutedGold-dark">
              ({percentage}%)
            </span>
          </div>
        </div>

        <div className="w-full sm:w-64 h-2.5 bg-softPink/50 rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-dustyRose to-mutedGold rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
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

      {/* Bucket List Items */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-4 border-burgundy border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-burgundy/70 mt-2">Memuat daftar impian...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dustyRose/20 shadow-sm">
          <CheckSquare className="w-12 h-12 text-mutedGold mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-lg font-bold text-burgundy">Belum Ada Impian Terdaftar</h3>
          <p className="text-xs text-burgundy/60 mt-1 mb-4">
            Tambahkan impian liburan, kencan, atau rencana masa depan kalian.
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
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm border transition-all flex items-start justify-between gap-4 ${
                item.completed
                  ? "border-mutedGold/40 bg-softPink/10"
                  : "border-dustyRose/20 hover:border-dustyRose/50"
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {/* Clickable Status Check */}
                <button
                  type="button"
                  onClick={() => handleToggle(item)}
                  className="mt-0.5 text-burgundy shrink-0 hover:scale-110 transition-transform"
                  title={item.completed ? "Tandai belum selesai" : "Tandai sudah selesai"}
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-mutedGold fill-softPink" />
                  ) : (
                    <Circle className="w-5 h-5 text-dustyRose" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className={`font-serif text-base font-bold transition-colors ${
                        item.completed
                          ? "text-burgundy/60 line-through decoration-mutedGold"
                          : "text-burgundy"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-softPink text-[10px] font-semibold text-burgundy">
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </span>
                  </div>

                  {item.note && (
                    <p className="text-xs text-burgundy/70 mt-1 leading-relaxed">
                      {item.note}
                    </p>
                  )}

                  {item.completed && item.completedDate && (
                    <span className="inline-block mt-1 text-[10px] text-mutedGold-dark font-medium">
                      ✨ Terwujud: {item.completedDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
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
                {editingId ? "Sunting Impian" : "Tambah Impian Baru"}
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
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                  Judul Impian / Rencana
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Menikmati senja di pantai Bali bersama"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                  Catatan Manis (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Contoh: Berjalan tanpa alas kaki di atas pasir putih..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy leading-relaxed"
                ></textarea>
              </div>

              {/* Status checklist */}
              <div className="p-3 rounded-xl bg-softPink/30 border border-dustyRose/20 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="bucketCompleted"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                    className="rounded text-burgundy focus:ring-burgundy w-4 h-4"
                  />
                  <label htmlFor="bucketCompleted" className="text-xs font-semibold text-burgundy cursor-pointer">
                    Sudah terwujud bersama
                  </label>
                </div>

                {completed && (
                  <div>
                    <label className="block text-[11px] font-semibold text-burgundy mb-1">
                      Tanggal Terwujud
                    </label>
                    <input
                      type="text"
                      value={completedDate}
                      onChange={(e) => setCompletedDate(e.target.value)}
                      placeholder="Contoh: 15 Agustus 2024"
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-dustyRose/30 text-xs text-burgundy outline-none"
                    />
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
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-dark text-ivory text-xs font-semibold tracking-wider transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving ? (
                    <span>Menyimpan...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-mutedGold" />
                      <span>{editingId ? "Perbarui Impian" : "Simpan Impian"}</span>
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
