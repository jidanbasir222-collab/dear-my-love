# OUR LITTLE UNIVERSE ✨💍

> *"Every love story has a universe. This one is ours."*

Website hadiah anniversary digital yang romantis, elegan, dan personal, dibuat dengan **Next.js (App Router)**, **JavaScript (JSX)**, **Tailwind CSS**, **Framer Motion**, dan **SQLite (Prisma)**. Mengikuti identitas visual desain Google Stitch AI dengan palet warna Ivory, Soft Pink, Dusty Rose, Burgundy, dan Muted Gold.

---

## 🌟 Fitur Utama Website (9 Halaman / Sesi)

1. **Halaman 1 — Welcome / Hero**:
   - Tampilan pembuka sinematik & romantis dengan foto pasangan utama.
   - Efek partikel bintang dan hati melayang (*floating hearts & stardust*).
   - Tombol interaktif **"Buka Kisah Kita"** yang secara otomatis memicu pemutaran melodi romantis dan melakukan *smooth scroll* ke hitungan cinta.

2. **Halaman 2 — Hitungan Cinta (Love Counter)**:
   - Penghitung waktu hubungan *real-time* yang berdetik setiap detik: **Tahun, Bulan, Hari, Jam, Menit, dan Detik**.
   - Dilengkapi rangkuman total hari kebersamaan.
   - Tanggal dan jam jadian dapat diubah sewaktu-waktu melalui dasbor admin.

3. **Halaman 3 — Perjalanan Kita (Our Journey)**:
   - Linimasa (*timeline*) interaktif perjalanan cinta dengan simpul hati bercahaya.
   - Menyimpan tanggal bersejarah, judul babak, lokasi spesial, foto kenangan, dan narasi cerita.
   - Dapat ditambah, diubah, dihapus, dan diurutkan dari admin.

4. **Halaman 4 — Galeri Kenangan (Our Memories)**:
   - Galeri foto polaroid bergaya *scrapbook* dengan kemiringan sudut realistis dan bayangan lembut.
   - Filter kategori: *Semua, Kencan Pertama, Liburan, Momen Spesial, Lucu / Random*.
   - **Full-screen Lightbox**: Klik pada foto mana saja untuk membuka tampilan layar penuh berbingkai polaroid dengan navigasi *Next / Prev* dan keyboard (*Escape*, tombol panah).

5. **Halaman 5 — Surat Untukmu (A Letter For You)**:
   - Amplop surat interaktif bersegel lilin merah burgundy dan lambang hati emas.
   - Animasi buka amplop dengan kertas bertekstur *parchment paper* dan tipografi tulisan tangan (*Dancing Script*).
   - Tombol untuk melipat kembali surat. Seluruh isi surat dapat disunting melalui admin.

6. **Halaman 6 — Soundtrack Kita (Our Soundtrack)**:
   - Pemutar musik HTML5 interaktif lengkap dengan piringan hitam (*vinyl disc*), sampul album, pengatur durasi (*scrub bar*), tombol *play/pause*, *next*, *prev*, dan pengatur volume.
   - **Persistent Floating Player**: Pemutar musik melayang di sudut kanan bawah yang tetap aktif saat pengunjung menjelajah seluruh halaman tanpa terputus.

7. **Halaman 7 — Kejutan Kecil (Little Surprise)**:
   - Kotak kado 3D dengan pita satin emas.
   - Sentuh pita untuk membuka: menghasilkan ledakan kembang api konfeti (*canvas-confetti*), pesan cinta rahasia, foto kejutan, dan *Kupon Cinta Seumur Hidup*.

8. **Halaman 8 — Masa Depan Kita (Our Future / Bucket List)**:
   - Daftar impian bersama dengan bilah kemajuan persentase (*progress bar*).
   - Filter kategori: *Travel, Kencan, Pengalaman, Mimpi Bersama*.
   - Kartu interaktif yang dapat dicentang langsung dengan tanggal terwujud.

9. **Halaman 9 — Pesan Terakhir (Closing Section)**:
   - Ucapan penutup: *"Thank you for being my favorite part of every day."*
   - Foto penutup pasangan berbingkai polaroid emas, animasi denyut jantung, dan tautan rahasia menuju Ruang Admin.

---

## 🔒 Ruang Pengelola Pribadi (Admin Dashboard)

Dasbor admin terlindungi dengan keamanan otentikasi kata sandi terenkripsi (bcryptjs) dan sesi cookie HTTP-only:

- **Rute Admin**: `/admin`
- **Login Admin**: `/admin/login`
- **Kredensial Bawaan**:
  - **Username**: `admin`
  - **Kata Sandi**: `admin123` *(Dapat diganti kapan saja di menu Pengaturan)*

### Kemampuan Dasbor Admin:
1. **Ikhtisar (Dashboard)**: Statistik jumlah kenangan, momen linimasa, lagu playlist, dan progres impian.
2. **Galeri Kenangan**: Unggah foto baru dari perangkat atau tempel URL, atur caption, tanggal, kategori, dan sudut kemiringan polaroid.
3. **Linimasa Kisah**: Tambah babak perjalanan baru, atur urutan kronologis, lokasi, dan foto.
4. **Surat Cinta**: Sunting penerima, judul surat, isi paragraf, dan tanda tangan dengan pratinjau langsung di kertas surat.
5. **Playlist Musik**: Tambah lagu, unggah berkas MP3 langsung dari komputer, atur gambar sampul album, dan tentukan lagu utama.
6. **Kejutan Kado**: Ubah pesan rahasia, kupon cinta, dan foto kado.
7. **Impian Masa Depan**: Tambah rencana baru, ubah kategori, centang status terwujud.
8. **Pengaturan Website**: Ubah nama kedua pasangan, tanggal acuan hitungan cinta, foto beranda, foto penutup, slogan, dan perbarui kata sandi admin.

---

## 🚀 Panduan Menjalankan Website Secara Lokal

### 1. Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Buka browser di:
- **Website Utama**: [http://localhost:3000](http://localhost:3000)
- **Dasbor Admin**: [http://localhost:3000/admin](http://localhost:3000/admin)

### 2. Membangun untuk Produksi (Production Build)
```bash
npm run build
npm start
```

---

## 📁 Struktur Direktori

```
├── app/
│   ├── admin/               # Halaman Dasbor Admin (Overview, Memories, Timeline, Letter, dll)
│   ├── api/                 # Endpoint REST API (Auth, Upload, Settings, Memories, dll)
│   ├── globals.css          # Tema warna Stitch AI, tekstur kertas, polaroid & animasi
│   ├── layout.js            # Layout utama, konfigurasi Google Fonts Playfair, Jakarta, Dancing
│   └── page.js              # Landing page utama SSR dengan integrasi Prisma
├── components/
│   ├── sections/            # 9 Komponen Sesi Halaman Utama
│   ├── FloatingHearts.jsx   # Animasi partikel hati & bintang melayang
│   ├── FloatingMusicPlayer.jsx # Mini player piringan hitam persistent
│   ├── ImageLightbox.jsx    # Modal lightbox foto polaroid layar penuh
│   ├── MusicContext.jsx     # State management pemutar audio HTML5
│   ├── Navbar.jsx           # Navigasi responsif kaca lembut (glassmorphism hangat)
│   └── UniverseView.jsx     # Client view wrapper pengatur state interaktif
├── lib/
│   ├── auth.js              # Helper verifikasi JWT & enkripsi kata sandi
│   └── prisma.js            # Prisma Client singleton
├── prisma/
│   ├── schema.prisma        # Skema database SQLite
│   ├── seed.js              # Script pengisian data awal romantis
│   └── dev.db               # Database SQLite lokal
└── public/
    └── uploads/             # Direktori penyimpanan berkas foto & lagu yang diunggah
```
