const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database for OUR LITTLE UNIVERSE (Dear My Love)...");

  const dataPath = path.join(__dirname, "seed-data.json");
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const data = JSON.parse(rawData);

  // 1. Admin
  for (const admin of data.admins) {
    await prisma.admin.upsert({
      where: { username: admin.username },
      update: { passwordHash: admin.passwordHash },
      create: {
        username: admin.username,
        passwordHash: admin.passwordHash,
      },
    });
  }

  // 2. Settings
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {
      coupleName1: data.settings.coupleName1,
      coupleName2: data.settings.coupleName2,
      anniversaryDate: data.settings.anniversaryDate,
      websiteTitle: data.settings.websiteTitle,
      tagline: data.settings.tagline,
      heroPhoto: data.settings.heroPhoto,
      finalMessage: data.settings.finalMessage,
      finalPhoto: data.settings.finalPhoto,
      themeColors: data.settings.themeColors,
    },
    create: {
      id: 1,
      coupleName1: data.settings.coupleName1,
      coupleName2: data.settings.coupleName2,
      anniversaryDate: data.settings.anniversaryDate,
      websiteTitle: data.settings.websiteTitle,
      tagline: data.settings.tagline,
      heroPhoto: data.settings.heroPhoto,
      finalMessage: data.settings.finalMessage,
      finalPhoto: data.settings.finalPhoto,
      themeColors: data.settings.themeColors,
    },
  });

  // 3. Milestones
  await prisma.timelineMilestone.deleteMany({});
  for (const item of data.milestones) {
    await prisma.timelineMilestone.create({
      data: {
        id: item.id,
        order: item.order,
        date: item.date,
        title: item.title,
        description: item.description,
        photoUrl: item.photoUrl,
        location: item.location,
      },
    });
  }

  // 4. Memories
  await prisma.memory.deleteMany({});
  for (const item of data.memories) {
    await prisma.memory.create({
      data: {
        id: item.id,
        title: item.title,
        caption: item.caption,
        date: item.date,
        photoUrl: item.photoUrl,
        category: item.category,
        rotation: item.rotation,
      },
    });
  }

  // 5. Letter
  await prisma.letter.upsert({
    where: { id: 1 },
    update: {
      recipient: data.letter.recipient,
      title: data.letter.title,
      content: data.letter.content,
      signature: data.letter.signature,
      date: data.letter.date,
    },
    create: {
      id: 1,
      recipient: data.letter.recipient,
      title: data.letter.title,
      content: data.letter.content,
      signature: data.letter.signature,
      date: data.letter.date,
    },
  });

  // 6. Songs
  await prisma.song.deleteMany({});
  for (const item of data.songs) {
    await prisma.song.create({
      data: {
        id: item.id,
        title: item.title,
        artist: item.artist,
        audioUrl: item.audioUrl,
        coverUrl: item.coverUrl,
        duration: item.duration,
        order: item.order,
        isDefault: item.isDefault,
      },
    });
  }

  // 7. Surprise
  await prisma.surprise.upsert({
    where: { id: 1 },
    update: {
      boxTitle: data.surprise.boxTitle,
      boxSubtitle: data.surprise.boxSubtitle,
      message: data.surprise.message,
      photoUrl: data.surprise.photoUrl,
      badge: data.surprise.badge,
      couponText: data.surprise.couponText,
    },
    create: {
      id: 1,
      boxTitle: data.surprise.boxTitle,
      boxSubtitle: data.surprise.boxSubtitle,
      message: data.surprise.message,
      photoUrl: data.surprise.photoUrl,
      badge: data.surprise.badge,
      couponText: data.surprise.couponText,
    },
  });

  // 8. Bucket Items
  await prisma.bucketItem.deleteMany({});
  for (const item of data.bucket) {
    await prisma.bucketItem.create({
      data: {
        id: item.id,
        title: item.title,
        category: item.category,
        completed: item.completed,
        completedDate: item.completedDate,
        note: item.note,
        order: item.order,
      },
    });
  }

  console.log("Database seeded successfully with all personal memories and content!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
