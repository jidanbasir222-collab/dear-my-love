const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database for OUR LITTLE UNIVERSE...");

  // 1. Admin account
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("admin123", salt);

  await prisma.admin.upsert({
    where: { username: "admin" },
    update: { passwordHash },
    create: {
      username: "admin",
      passwordHash,
    },
  });

  // 2. Site Settings
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      coupleName1: "ahmad zaidan",
      coupleName2: "zaskia nisa syabani",
      anniversaryDate: "2023-11-22T00:00:00",
      websiteTitle: "OUR LITTLE UNIVERSE",
      tagline: "Every love story has a universe. This one is ours.",
      heroPhoto: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80",
      finalMessage: "Terima kasih telah menjadi bagian terindah dalam setiap hariku. Bersamamu, hal-hal sederhana terasa begitu luar biasa.",
      finalPhoto: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80",
      themeColors: JSON.stringify({
        ivory: "#FFF9F3",
        softPink: "#F3D5D8",
        dustyRose: "#D9A6AC",
        burgundy: "#743B4A",
        mutedGold: "#C7A36B"
      }),
    },
  });

  // 3. Timeline Milestones
  await prisma.timelineMilestone.deleteMany({});
  await prisma.timelineMilestone.createMany({
    data: [
      {
        order: 1,
        date: "14 Februari 2023",
        title: "Awal Mula Pertemuan",
        description: "Hari di mana tatap mata kita pertama kali bertemu di sebuah kedai kopi kecil. Senyuman manismu seketika mengubah duniaku.",
        photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
        location: "Kopi Kenangan Senja, Bandung",
      },
      {
        order: 2,
        date: "22 November 2023",
        title: "Hari Kita Mengikat Janji",
        description: "Malam yang penuh gemintang saat kita memutuskan untuk mengarungi semesta ini bersama sebagai sepasang kekasih.",
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        location: "Taman Bintang, Lembang",
      },
      {
        order: 3,
        date: "14 Juli 2024",
        title: "Liburan Pertama ke Pantai",
        description: "Menyaksikan matahari terbenam bersama deburan ombak. Tawamu di bawah langit senja adalah pemandangan paling indah.",
        photoUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        location: "Pantai Parangtritis, Yogyakarta",
      },
      {
        order: 4,
        date: "25 Desember 2024",
        title: "Melewati Badai Bersama",
        description: "Bukan tentang selalu bahagia, tapi bagaimana tangan kita tak pernah saling melepaskan meski hari terasa berat.",
        photoUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=800&q=80",
        location: "Jakarta",
      },
      {
        order: 5,
        date: "22 November 2025",
        title: "Satu Tahun Penuh Cinta",
        description: "Merayakan 365 hari penuh tawa, cerita konyol, dan cinta yang semakin mendalam setiap harinya.",
        photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
        location: "Skyline Dining",
      },
      {
        order: 6,
        date: "Hari Ini & Seterusnya",
        title: "Menua Bersamamu",
        description: "Setiap detik bersamamu adalah berkah yang selalu kusyukuri. Kisah kita baru saja dimulai.",
        photoUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
        location: "Di Masa Depan Kita",
      },
    ],
  });

  // 4. Memories
  await prisma.memory.deleteMany({});
  await prisma.memory.createMany({
    data: [
      {
        title: "Kopi Pertama & Rasa Gugup",
        caption: "Masih ingat betapa gemetarnya tanganku saat pertama kali memesankan minuman untukmu.",
        date: "14 Feb 2023",
        photoUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
        category: "Kencan Pertama",
        rotation: -2.5,
      },
      {
        title: "Senja di Tepi Pantai",
        caption: "Angin laut yang menerpa rambutmu dan tawa lepas kita di atas pasir putih.",
        date: "14 Jul 2024",
        photoUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        category: "Liburan",
        rotation: 3.2,
      },
      {
        title: "Ulang Tahunmu yang Manis",
        caption: "Melihat binar matamu saat meniup lilin adalah definisi kebahagiaanku.",
        date: "18 Agu 2024",
        photoUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80",
        category: "Momen Spesial",
        rotation: -1.8,
      },
      {
        title: "Muka Konyol Saat Kehujanan",
        caption: "Basah kuyup berteduh di halte bus tapi kita malah tertawa terbahak-bahak tanpa peduli dingin.",
        date: "05 Okt 2024",
        photoUrl: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
        category: "Lucu / Random",
        rotation: 2.8,
      },
      {
        title: "Nonton Bioskop Berdua",
        caption: "Pura-pura fokus ke layar film, padahal deg-degan setiap jemari kita bersentuhan.",
        date: "01 Mar 2023",
        photoUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
        category: "Kencan Pertama",
        rotation: -3.0,
      },
      {
        title: "Mendaki Bukit Menanti Pagi",
        caption: "Kabut dingin subuh yang seketika hangat oleh genggaman tanganmu.",
        date: "20 Jan 2025",
        photoUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
        category: "Liburan",
        rotation: 1.5,
      },
    ],
  });

  // 5. Letter
  await prisma.letter.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      recipient: "Untuk zaskia nisa syabani, Bidadari Semestaku",
      title: "Sebuah Surat Dari Lubuk Hatiku",
      content: `Sayangku,

Jika semesta ini begitu luas dan tak bertepi, maka rasa cintaku padamu jauh melampaui segala galaksi yang ada.

Terima kasih telah hadir dalam hidupku, membawa pelangi pada hari-hari yang dulu terasa kelabu. Terima kasih atas setiap senyuman manismu yang selalu menjadi penenang di saat duniaku bising dan lelah, serta pelukan hangatmu yang selalu membuatku merasa memiliki rumah sejati.

Bersamamu, aku belajar bahwa mencintai bukanlah tentang menemukan kesempurnaan, melainkan tentang saling menggenggam erat dan bertumbuh bersama melintasi suka dan duka. Aku bersyukur untuk setiap detik tawa yang kita bagi, cerita acak sebelum tidur, hingga perdebatan kecil yang selalu berakhir dengan saling memeluk erat.

Di hari jadi kita ini, aku berjanji: aku akan terus memilihmu, hari ini, esok, dan selamanya. Selama nafasku berhembus, semesta kecil ini akan selalu kujaga dan kupenuhi dengan kasih sayang hanya untukmu.

Selamat hari jadi, cintaku. Aku mencintaimu lebih dari jutaan bintang di langit malam.`,
      signature: "Selamanya milikmu, ahmad zaidan ❤️",
      date: "22 November",
    },
  });

  // 6. Songs
  await prisma.song.deleteMany({});
  await prisma.song.createMany({
    data: [
      {
        order: 1,
        title: "Until I Found You",
        artist: "Stephen Sanchez",
        duration: "2:57",
        audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3",
        coverUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=300&q=80",
        isDefault: true,
      },
      {
        order: 2,
        title: "Golden Hour (Acoustic Strings)",
        artist: "JVKE",
        duration: "3:29",
        audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=tender-love-10874.mp3",
        coverUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=300&q=80",
        isDefault: false,
      },
      {
        order: 3,
        title: "Sempurna (Acoustic Romance)",
        artist: "Andra and The Backbone",
        duration: "4:12",
        audioUrl: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=acoustic-guitar-love-melody-110055.mp3",
        coverUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=300&q=80",
        isDefault: false,
      },
      {
        order: 4,
        title: "Universe For Two",
        artist: "Lofi Melodies",
        duration: "3:10",
        audioUrl: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=sweet-love-10492.mp3",
        coverUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=300&q=80",
        isDefault: false,
      },
    ],
  });

  // 7. Surprise
  await prisma.surprise.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      boxTitle: "Ada Satu Kejutan Kecil Untukmu...",
      boxSubtitle: "Sentuh pita kado ini untuk membukanya",
      message: "Selamat Hari Jadi, Sayangku! Dari miliaran jiwa dan bintang di alam semesta ini, takdir mempertemukanku denganmu. Kamu adalah anugerah terindah yang Tuhan titipkan padaku. Aku sangat mencintaimu, hari ini dan selamanya! ✨💖",
      photoUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80",
      badge: "Kado Cinta Abadi",
      couponText: "🎫 Kupon Spesial: Berlaku selamanya untuk pelukan tanpa batas, es krim gratis saat kamu sedih, dan kencan impian kemanapun kamu inginkan!",
    },
  });

  // 8. Bucket List Items
  await prisma.bucketItem.deleteMany({});
  await prisma.bucketItem.createMany({
    data: [
      {
        order: 1,
        title: "Melihat Aurora Borealis di Tromsø berdua",
        category: "Travel",
        completed: false,
        note: "Menatap langit hijau menari sambil minum cokelat panas bergandengan tangan",
      },
      {
        order: 2,
        title: "Menikmati senja di pantai Bali bersama",
        category: "Travel",
        completed: true,
        completedDate: "15 Agustus 2024",
        note: "Momen magis saat langit berubah jingga keemasan",
      },
      {
        order: 3,
        title: "Jalan-jalan musim gugur di Kyoto, Jepang",
        category: "Travel",
        completed: false,
        note: "Mengenakan kimono bersama di antara daun maple merah",
      },
      {
        order: 4,
        title: "Piknik santai di bawah pohon rindang sambil membaca buku",
        category: "Kencan",
        completed: true,
        completedDate: "10 Mei 2024",
        note: "Membawa buah segar dan sandwich buatanmu yang lezat",
      },
      {
        order: 5,
        title: "Candlelight dinner di rooftop beratapkan bintang",
        category: "Kencan",
        completed: false,
        note: "Menari pelan dengan lagu favorit kita",
      },
      {
        order: 6,
        title: "Memasak makan malam spesial berdua dari resep baru",
        category: "Pengalaman",
        completed: true,
        completedDate: "20 September 2024",
        note: "Dapur berantakan tapi pasta yang kita buat luar biasa lezat",
      },
      {
        order: 7,
        title: "Menonton konser musisi favorit kita bersama",
        category: "Pengalaman",
        completed: false,
        note: "Bernyanyi sekencang mungkin sampai suara kita serak",
      },
      {
        order: 8,
        title: "Punya rumah mungil dengan taman bunga dan teras hangat",
        category: "Mimpi Bersama",
        completed: false,
        note: "Tempat kita pulang dan saling mendengarkan kisah harian",
      },
      {
        order: 9,
        title: "Menua bersama dengan cinta yang tak pernah luntur",
        category: "Mimpi Bersama",
        completed: false,
        note: "Rambut boleh memutih, tapi genggaman kita tetap sehangat hari pertama",
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
