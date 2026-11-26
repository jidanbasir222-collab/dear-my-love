"use client";

import { useState, useEffect } from "react";
import {
  Music,
  Plus,
  Trash2,
  Edit2,
  Upload,
  Play,
  Pause,
  Sparkles,
  Check,
  X,
  Disc,
} from "lucide-react";

export default function AdminMusicPage() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [duration, setDuration] = useState("3:30");
  const [isDefault, setIsDefault] = useState(false);
  const [order, setOrder] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Preview audio playing
  const [previewAudio, setPreviewAudio] = useState(null);
  const [playingSongId, setPlayingSongId] = useState(null);

  const fetchSongs = async () => {
    try {
      const res = await fetch("/api/songs");
      if (res.ok) {
        const data = await res.json();
        setSongs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
    return () => {
      if (previewAudio) previewAudio.pause();
    };
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setTitle("");
    setArtist("");
    setAudioUrl("");
    setCoverUrl("");
    setDuration("3:30");
    setIsDefault(songs.length === 0);
    setOrder(songs.length + 1);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (song) => {
    setEditingId(song.id);
    setTitle(song.title);
    setArtist(song.artist);
    setAudioUrl(song.audioUrl);
    setCoverUrl(song.coverUrl || "");
    setDuration(song.duration || "3:30");
    setIsDefault(song.isDefault || false);
    setOrder(song.order || 0);
    setError("");
    setShowModal(true);
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAudio(true);
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
        setAudioUrl(data.url);
      } else {
        setError(data.error || "Gagal mengunggah berkas audio.");
      }
    } catch (err) {
      setError("Kesalahan koneksi saat unggah audio.");
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
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
        setCoverUrl(data.url);
      } else {
        setError(data.error || "Gagal mengunggah gambar sampul.");
      }
    } catch (err) {
      setError("Kesalahan saat unggah gambar.");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !artist || !audioUrl) {
      setError("Judul, penyanyi, dan URL audio lagu wajib diisi.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const url = editingId ? `/api/songs/${editingId}` : "/api/songs";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          artist,
          audioUrl,
          coverUrl: coverUrl || null,
          duration,
          isDefault,
          order: parseInt(order, 10) || 0,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(editingId ? "Lagu berhasil diperbarui!" : "Lagu berhasil ditambahkan!");
        setShowModal(false);
        fetchSongs();
      } else {
        setError(data.error || "Gagal menyimpan lagu.");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah kamu yakin ingin menghapus lagu ini dari playlist?")) return;

    try {
      const res = await fetch(`/api/songs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSongs((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      alert("Gagal menghapus lagu.");
    }
  };

  const togglePreview = (song) => {
    if (playingSongId === song.id) {
      if (previewAudio) {
        previewAudio.pause();
        setPlayingSongId(null);
      }
    } else {
      if (previewAudio) previewAudio.pause();
      const audio = new Audio(song.audioUrl);
      audio.play().then(() => {
        setPreviewAudio(audio);
        setPlayingSongId(song.id);
      }).catch(err => {
        console.warn("Audio preview error:", err);
      });
      audio.onended = () => setPlayingSongId(null);
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
            Playlist Lagu Soundtrack
          </h1>
          <p className="text-xs sm:text-sm text-burgundy/70 mt-1">
            Kelola lagu-lagu romantis yang mengiringi situs, unggah berkas MP3, atau gunakan audio tautan.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-burgundy hover:bg-burgundy-dark text-ivory text-xs font-semibold tracking-wider transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4 text-mutedGold" />
          <span>Tambah Lagu Baru</span>
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

      {/* Songs List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-4 border-burgundy border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-burgundy/70 mt-2">Memuat playlist lagu...</p>
        </div>
      ) : songs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dustyRose/20 shadow-sm">
          <Music className="w-12 h-12 text-mutedGold mx-auto mb-3 opacity-60" />
          <h3 className="font-serif text-lg font-bold text-burgundy">Playlist Masih Kosong</h3>
          <p className="text-xs text-burgundy/60 mt-1 mb-4">
            Tambahkan lagu romantis kenangan kalian berdua.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-burgundy text-ivory text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Lagu</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {songs.map((song) => {
            const isPlayingThis = playingSongId === song.id;
            return (
              <div
                key={song.id}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-dustyRose/20 hover:border-dustyRose/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Album Cover & Play preview button */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-burgundy-deep text-white shrink-0 shadow-sm group cursor-pointer"
                       onClick={() => togglePreview(song)}>
                    {song.coverUrl ? (
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Disc className="w-6 h-6 text-mutedGold" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                      {isPlayingThis ? (
                        <Pause className="w-5 h-5 text-white fill-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif text-base font-bold text-burgundy truncate">
                        {song.title}
                      </h3>
                      {song.isDefault && (
                        <span className="px-2 py-0.5 rounded-full bg-softPink text-[10px] font-semibold text-burgundy">
                          Lagu Utama
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-burgundy/70 truncate mt-0.5">{song.artist}</p>
                    <span className="text-[10px] text-mutedGold-dark font-mono">{song.duration}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => openEditModal(song)}
                    className="p-2 text-burgundy/70 hover:text-burgundy hover:bg-softPink/40 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Sunting</span>
                  </button>
                  <button
                    onClick={() => handleDelete(song.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-xs font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog for Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burgundy-deep/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-dustyRose/40 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-dustyRose/20 mb-5">
              <h3 className="font-serif text-xl font-bold text-burgundy">
                {editingId ? "Sunting Lagu" : "Tambah Lagu Baru"}
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
              {/* Title & Artist */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                  Judul Lagu
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Until I Found You"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                  Penyanyi / Artis
                </label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Contoh: Stephen Sanchez"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy"
                />
              </div>

              {/* Audio File Input (Upload or URL) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                  Berkas Audio (MP3 / WAV)
                </label>
                <div className="space-y-2">
                  <label className="cursor-pointer py-2 px-4 rounded-xl bg-softPink/30 hover:bg-softPink/60 text-burgundy text-xs font-semibold text-center border border-dashed border-dustyRose flex items-center justify-center gap-2 transition-colors">
                    <Upload className="w-4 h-4 text-mutedGold" />
                    <span>{uploadingAudio ? "Mengunggah audio..." : "Unggah Berkas Audio dari Komputer"}</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                      disabled={uploadingAudio}
                    />
                  </label>

                  <input
                    type="text"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    placeholder="Atau tempel URL audio (https://...)"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Cover Art Input */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                  Gambar Sampul Album (Opsional)
                </label>
                <div className="space-y-2">
                  <label className="cursor-pointer py-2 px-4 rounded-xl bg-softPink/30 hover:bg-softPink/60 text-burgundy text-xs font-semibold text-center border border-dashed border-dustyRose flex items-center justify-center gap-2 transition-colors">
                    <Upload className="w-4 h-4 text-mutedGold" />
                    <span>{uploadingCover ? "Mengunggah gambar..." : "Unggah Sampul Album"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                      disabled={uploadingCover}
                    />
                  </label>

                  <input
                    type="text"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="Atau tempel URL gambar (https://...)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy text-[11px]"
                  />
                </div>
              </div>

              {/* Duration & Order */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-burgundy mb-1">
                    Durasi (mm:ss)
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="3:45"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-ivory border border-dustyRose/30 text-xs text-burgundy outline-none focus:border-burgundy font-mono"
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

              {/* Set as Default checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded text-burgundy focus:ring-burgundy w-4 h-4"
                />
                <label htmlFor="isDefault" className="text-xs font-semibold text-burgundy cursor-pointer">
                  Jadikan lagu utama yang diputar otomatis pertama kali
                </label>
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
                  disabled={saving || uploadingAudio || uploadingCover}
                  className="px-5 py-2 rounded-xl bg-burgundy hover:bg-burgundy-dark text-ivory text-xs font-semibold tracking-wider transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving ? (
                    <span>Menyimpan...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-mutedGold" />
                      <span>{editingId ? "Perbarui Lagu" : "Simpan Lagu"}</span>
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
