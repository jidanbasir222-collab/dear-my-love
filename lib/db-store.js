import fs from "fs";
import path from "path";
import prisma from "./prisma";
import { revalidatePath } from "next/cache";
import defaultSeedData from "../prisma/seed-data.json";

const SEED_DATA_PATH = path.join(process.cwd(), "prisma", "seed-data.json");

// In-memory cache in case disk is read-only (e.g. Vercel serverless without DB)
let memoryStore = { ...defaultSeedData };

function getLocalData() {
  try {
    if (fs.existsSync(SEED_DATA_PATH)) {
      const content = fs.readFileSync(SEED_DATA_PATH, "utf8");
      const parsed = JSON.parse(content);
      memoryStore = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn("Notice: Reading from seed file failed, using memory store:", err.message);
  }
  return memoryStore;
}

function saveLocalData(newData) {
  memoryStore = { ...memoryStore, ...newData };
  try {
    if (fs.existsSync(SEED_DATA_PATH)) {
      fs.writeFileSync(SEED_DATA_PATH, JSON.stringify(memoryStore, null, 2), "utf8");
    }
  } catch (err) {
    // In Vercel serverless environment, filesystem is read-only.
    // memoryStore holds it in memory for the lifecycle of the instance.
    console.warn("Notice: Local file write skipped (read-only environment):", err.message);
  }
}

function triggerRevalidation() {
  try {
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/settings");
    revalidatePath("/admin/timeline");
    revalidatePath("/admin/memories");
    revalidatePath("/admin/music");
    revalidatePath("/admin/letter");
    revalidatePath("/admin/surprise");
    revalidatePath("/admin/bucket");
  } catch (err) {
    // Revalidation is a bonus during API execution
  }
}

// ==================== SETTINGS ====================
export async function getSettings() {
  try {
    const dbSettings = await prisma.siteSettings.findFirst({ where: { id: 1 } });
    if (dbSettings) return dbSettings;
  } catch (err) {
    console.warn("Prisma getSettings fallback:", err.message);
  }
  return getLocalData().settings || defaultSeedData.settings;
}

export async function updateSettings(data) {
  let result = null;
  try {
    result = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {
        coupleName1: data.coupleName1 !== undefined ? data.coupleName1 : undefined,
        coupleName2: data.coupleName2 !== undefined ? data.coupleName2 : undefined,
        anniversaryDate: data.anniversaryDate !== undefined ? data.anniversaryDate : undefined,
        websiteTitle: data.websiteTitle !== undefined ? data.websiteTitle : undefined,
        tagline: data.tagline !== undefined ? data.tagline : undefined,
        heroPhoto: data.heroPhoto !== undefined ? data.heroPhoto : undefined,
        finalMessage: data.finalMessage !== undefined ? data.finalMessage : undefined,
        finalPhoto: data.finalPhoto !== undefined ? data.finalPhoto : undefined,
        themeColors: data.themeColors !== undefined
          ? (typeof data.themeColors === "string" ? data.themeColors : JSON.stringify(data.themeColors))
          : undefined,
      },
      create: {
        id: 1,
        coupleName1: data.coupleName1 || "Ahmad zaidan",
        coupleName2: data.coupleName2 || "zaskia nisa syabani",
        anniversaryDate: data.anniversaryDate || "2026-09-08",
        websiteTitle: data.websiteTitle || "OUR LITTLE UNIVERSE",
        tagline: data.tagline || "Every love story has a universe. This one is ours.",
        heroPhoto: data.heroPhoto || "/uploads/1795665069349-biyaax.jpeg",
        finalMessage: data.finalMessage || "Terima kasih telah menjadi bagian terindah dalam setiap hariku.",
        finalPhoto: data.finalPhoto || "/uploads/1795665089116-qiv8pc.jpeg",
      },
    });
  } catch (err) {
    console.warn("Prisma updateSettings fallback:", err.message);
  }

  // Always update local/memory store so edits persist locally
  const current = getLocalData();
  const updatedSettings = { ...current.settings, ...data, id: 1 };
  saveLocalData({ settings: updatedSettings });
  triggerRevalidation();

  return result || updatedSettings;
}

// ==================== SONGS ====================
export async function getSongs() {
  try {
    const dbSongs = await prisma.song.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    if (dbSongs && dbSongs.length > 0) return dbSongs;
  } catch (err) {
    console.warn("Prisma getSongs fallback:", err.message);
  }
  return getLocalData().songs || defaultSeedData.songs;
}

export async function createSong(data) {
  let created = null;
  try {
    if (data.isDefault) {
      await prisma.song.updateMany({ data: { isDefault: false } });
    }
    created = await prisma.song.create({
      data: {
        title: data.title,
        artist: data.artist,
        audioUrl: data.audioUrl,
        coverUrl: data.coverUrl || null,
        duration: data.duration || "3:30",
        order: data.order !== undefined ? parseInt(data.order, 10) : 0,
        isDefault: Boolean(data.isDefault),
      },
    });
  } catch (err) {
    console.warn("Prisma createSong fallback:", err.message);
  }

  const current = getLocalData();
  const currentSongs = Array.isArray(current.songs) ? [...current.songs] : [];
  if (data.isDefault) {
    currentSongs.forEach((s) => (s.isDefault = false));
  }
  const newSong = created || {
    id: Date.now(),
    title: data.title,
    artist: data.artist,
    audioUrl: data.audioUrl,
    coverUrl: data.coverUrl || null,
    duration: data.duration || "3:30",
    order: data.order !== undefined ? parseInt(data.order, 10) : currentSongs.length + 1,
    isDefault: Boolean(data.isDefault),
  };
  currentSongs.push(newSong);
  saveLocalData({ songs: currentSongs });
  triggerRevalidation();

  return created || newSong;
}

export async function updateSong(id, data) {
  const numId = parseInt(id, 10);
  let updated = null;
  try {
    if (data.isDefault) {
      await prisma.song.updateMany({
        where: { id: { not: numId } },
        data: { isDefault: false },
      });
    }
    updated = await prisma.song.update({
      where: { id: numId },
      data: {
        title: data.title !== undefined ? data.title : undefined,
        artist: data.artist !== undefined ? data.artist : undefined,
        audioUrl: data.audioUrl !== undefined ? data.audioUrl : undefined,
        coverUrl: data.coverUrl !== undefined ? data.coverUrl : undefined,
        duration: data.duration !== undefined ? data.duration : undefined,
        order: data.order !== undefined ? parseInt(data.order, 10) : undefined,
        isDefault: data.isDefault !== undefined ? Boolean(data.isDefault) : undefined,
      },
    });
  } catch (err) {
    console.warn("Prisma updateSong fallback:", err.message);
  }

  const current = getLocalData();
  let currentSongs = Array.isArray(current.songs) ? [...current.songs] : [];
  if (data.isDefault) {
    currentSongs.forEach((s) => (s.isDefault = false));
  }
  let found = false;
  currentSongs = currentSongs.map((s) => {
    if (s.id === numId) {
      found = true;
      return { ...s, ...data, id: numId };
    }
    return s;
  });
  if (!found) {
    currentSongs.push({ id: numId, ...data });
  }
  saveLocalData({ songs: currentSongs });
  triggerRevalidation();

  return updated || { id: numId, ...data };
}

export async function deleteSong(id) {
  const numId = parseInt(id, 10);
  try {
    await prisma.song.delete({ where: { id: numId } });
  } catch (err) {
    console.warn("Prisma deleteSong fallback:", err.message);
  }

  const current = getLocalData();
  const currentSongs = Array.isArray(current.songs)
    ? current.songs.filter((s) => s.id !== numId)
    : [];
  saveLocalData({ songs: currentSongs });
  triggerRevalidation();

  return { success: true };
}

// ==================== MILESTONES / TIMELINE ====================
export async function getMilestones() {
  try {
    const dbMilestones = await prisma.timelineMilestone.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    if (dbMilestones && dbMilestones.length > 0) return dbMilestones;
  } catch (err) {
    console.warn("Prisma getMilestones fallback:", err.message);
  }
  return getLocalData().milestones || defaultSeedData.milestones;
}

export async function createMilestone(data) {
  let created = null;
  try {
    created = await prisma.timelineMilestone.create({
      data: {
        date: data.date,
        title: data.title,
        description: data.description,
        photoUrl: data.photoUrl || null,
        location: data.location || null,
        order: data.order !== undefined ? parseInt(data.order, 10) : 0,
      },
    });
  } catch (err) {
    console.warn("Prisma createMilestone fallback:", err.message);
  }

  const current = getLocalData();
  const currentMilestones = Array.isArray(current.milestones) ? [...current.milestones] : [];
  const newMilestone = created || {
    id: Date.now(),
    date: data.date,
    title: data.title,
    description: data.description,
    photoUrl: data.photoUrl || null,
    location: data.location || null,
    order: data.order !== undefined ? parseInt(data.order, 10) : currentMilestones.length + 1,
  };
  currentMilestones.push(newMilestone);
  saveLocalData({ milestones: currentMilestones });
  triggerRevalidation();

  return created || newMilestone;
}

export async function updateMilestone(id, data) {
  const numId = parseInt(id, 10);
  let updated = null;
  try {
    updated = await prisma.timelineMilestone.update({
      where: { id: numId },
      data: {
        date: data.date !== undefined ? data.date : undefined,
        title: data.title !== undefined ? data.title : undefined,
        description: data.description !== undefined ? data.description : undefined,
        photoUrl: data.photoUrl !== undefined ? data.photoUrl : undefined,
        location: data.location !== undefined ? data.location : undefined,
        order: data.order !== undefined ? parseInt(data.order, 10) : undefined,
      },
    });
  } catch (err) {
    console.warn("Prisma updateMilestone fallback:", err.message);
  }

  const current = getLocalData();
  const currentMilestones = (current.milestones || []).map((m) =>
    m.id === numId ? { ...m, ...data, id: numId } : m
  );
  saveLocalData({ milestones: currentMilestones });
  triggerRevalidation();

  return updated || { id: numId, ...data };
}

export async function deleteMilestone(id) {
  const numId = parseInt(id, 10);
  try {
    await prisma.timelineMilestone.delete({ where: { id: numId } });
  } catch (err) {
    console.warn("Prisma deleteMilestone fallback:", err.message);
  }

  const current = getLocalData();
  const currentMilestones = (current.milestones || []).filter((m) => m.id !== numId);
  saveLocalData({ milestones: currentMilestones });
  triggerRevalidation();

  return { success: true };
}

// ==================== MEMORIES ====================
export async function getMemories(category = null) {
  try {
    const where = category && category !== "Semua" ? { category } : {};
    const dbMemories = await prisma.memory.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    if (dbMemories && dbMemories.length > 0) return dbMemories;
  } catch (err) {
    console.warn("Prisma getMemories fallback:", err.message);
  }

  const all = getLocalData().memories || defaultSeedData.memories;
  if (category && category !== "Semua") {
    return all.filter((m) => m.category === category);
  }
  return all;
}

export async function createMemory(data) {
  let created = null;
  try {
    created = await prisma.memory.create({
      data: {
        title: data.title,
        caption: data.caption || "",
        date: data.date,
        photoUrl: data.photoUrl,
        category: data.category || "Momen Spesial",
        rotation: data.rotation !== undefined ? parseFloat(data.rotation) : 0,
      },
    });
  } catch (err) {
    console.warn("Prisma createMemory fallback:", err.message);
  }

  const current = getLocalData();
  const currentMemories = Array.isArray(current.memories) ? [...current.memories] : [];
  const newMemory = created || {
    id: Date.now(),
    title: data.title,
    caption: data.caption || "",
    date: data.date,
    photoUrl: data.photoUrl,
    category: data.category || "Momen Spesial",
    rotation: data.rotation !== undefined ? parseFloat(data.rotation) : 0,
    createdAt: new Date().toISOString(),
  };
  currentMemories.unshift(newMemory);
  saveLocalData({ memories: currentMemories });
  triggerRevalidation();

  return created || newMemory;
}

export async function updateMemory(id, data) {
  const numId = parseInt(id, 10);
  let updated = null;
  try {
    updated = await prisma.memory.update({
      where: { id: numId },
      data: {
        title: data.title !== undefined ? data.title : undefined,
        caption: data.caption !== undefined ? data.caption : undefined,
        date: data.date !== undefined ? data.date : undefined,
        photoUrl: data.photoUrl !== undefined ? data.photoUrl : undefined,
        category: data.category !== undefined ? data.category : undefined,
        rotation: data.rotation !== undefined ? parseFloat(data.rotation) : undefined,
      },
    });
  } catch (err) {
    console.warn("Prisma updateMemory fallback:", err.message);
  }

  const current = getLocalData();
  const currentMemories = (current.memories || []).map((m) =>
    m.id === numId ? { ...m, ...data, id: numId } : m
  );
  saveLocalData({ memories: currentMemories });
  triggerRevalidation();

  return updated || { id: numId, ...data };
}

export async function deleteMemory(id) {
  const numId = parseInt(id, 10);
  try {
    await prisma.memory.delete({ where: { id: numId } });
  } catch (err) {
    console.warn("Prisma deleteMemory fallback:", err.message);
  }

  const current = getLocalData();
  const currentMemories = (current.memories || []).filter((m) => m.id !== numId);
  saveLocalData({ memories: currentMemories });
  triggerRevalidation();

  return { success: true };
}

// ==================== LETTER ====================
export async function getLetter() {
  try {
    const dbLetter = await prisma.letter.findFirst({ where: { id: 1 } });
    if (dbLetter) return dbLetter;
  } catch (err) {
    console.warn("Prisma getLetter fallback:", err.message);
  }
  return getLocalData().letter || defaultSeedData.letter;
}

export async function updateLetter(data) {
  let updated = null;
  try {
    updated = await prisma.letter.upsert({
      where: { id: 1 },
      update: {
        recipient: data.recipient !== undefined ? data.recipient : undefined,
        title: data.title !== undefined ? data.title : undefined,
        content: data.content !== undefined ? data.content : undefined,
        signature: data.signature !== undefined ? data.signature : undefined,
        date: data.date !== undefined ? data.date : undefined,
      },
      create: {
        id: 1,
        recipient: data.recipient || "Untuk zaskia nisa syabani, Bidadari Semestaku",
        title: data.title || "Sebuah Surat Dari Lubuk Hatiku",
        content: data.content || "",
        signature: data.signature || "Selamanya milikmu, Ahmad zaidan ❤️",
        date: data.date || "22 November",
      },
    });
  } catch (err) {
    console.warn("Prisma updateLetter fallback:", err.message);
  }

  const current = getLocalData();
  const updatedLetter = { ...current.letter, ...data, id: 1 };
  saveLocalData({ letter: updatedLetter });
  triggerRevalidation();

  return updated || updatedLetter;
}

// ==================== SURPRISE ====================
export async function getSurprise() {
  try {
    const dbSurprise = await prisma.surprise.findFirst({ where: { id: 1 } });
    if (dbSurprise) return dbSurprise;
  } catch (err) {
    console.warn("Prisma getSurprise fallback:", err.message);
  }
  return getLocalData().surprise || defaultSeedData.surprise;
}

export async function updateSurprise(data) {
  let updated = null;
  try {
    updated = await prisma.surprise.upsert({
      where: { id: 1 },
      update: {
        boxTitle: data.boxTitle !== undefined ? data.boxTitle : undefined,
        boxSubtitle: data.boxSubtitle !== undefined ? data.boxSubtitle : undefined,
        message: data.message !== undefined ? data.message : undefined,
        photoUrl: data.photoUrl !== undefined ? data.photoUrl : undefined,
        badge: data.badge !== undefined ? data.badge : undefined,
        couponText: data.couponText !== undefined ? data.couponText : undefined,
      },
      create: {
        id: 1,
        boxTitle: data.boxTitle || "Ada Satu Kejutan Kecil Untukmu...",
        boxSubtitle: data.boxSubtitle || "Sentuh pita kado ini untuk membukanya",
        message: data.message || "Selamat Hari Jadi, Sayangku!",
        photoUrl: data.photoUrl || "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1000&q=80",
        badge: data.badge || "Kado Cinta Abadi",
        couponText: data.couponText || "",
      },
    });
  } catch (err) {
    console.warn("Prisma updateSurprise fallback:", err.message);
  }

  const current = getLocalData();
  const updatedSurprise = { ...current.surprise, ...data, id: 1 };
  saveLocalData({ surprise: updatedSurprise });
  triggerRevalidation();

  return updated || updatedSurprise;
}

// ==================== BUCKET LIST ====================
export async function getBucketItems() {
  try {
    const dbBucket = await prisma.bucketItem.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    if (dbBucket && dbBucket.length > 0) return dbBucket;
  } catch (err) {
    console.warn("Prisma getBucketItems fallback:", err.message);
  }
  return getLocalData().bucket || defaultSeedData.bucket;
}

export async function createBucketItem(data) {
  let created = null;
  try {
    created = await prisma.bucketItem.create({
      data: {
        title: data.title,
        category: data.category || "Mimpi Bersama",
        completed: Boolean(data.completed),
        completedDate: data.completedDate || null,
        note: data.note || null,
        order: data.order !== undefined ? parseInt(data.order, 10) : 0,
      },
    });
  } catch (err) {
    console.warn("Prisma createBucketItem fallback:", err.message);
  }

  const current = getLocalData();
  const currentBucket = Array.isArray(current.bucket) ? [...current.bucket] : [];
  const newItem = created || {
    id: Date.now(),
    title: data.title,
    category: data.category || "Mimpi Bersama",
    completed: Boolean(data.completed),
    completedDate: data.completedDate || null,
    note: data.note || null,
    order: data.order !== undefined ? parseInt(data.order, 10) : currentBucket.length + 1,
  };
  currentBucket.push(newItem);
  saveLocalData({ bucket: currentBucket });
  triggerRevalidation();

  return created || newItem;
}

export async function updateBucketItem(id, data) {
  const numId = parseInt(id, 10);
  let updated = null;
  try {
    updated = await prisma.bucketItem.update({
      where: { id: numId },
      data: {
        title: data.title !== undefined ? data.title : undefined,
        category: data.category !== undefined ? data.category : undefined,
        completed: data.completed !== undefined ? Boolean(data.completed) : undefined,
        completedDate: data.completedDate !== undefined ? data.completedDate : undefined,
        note: data.note !== undefined ? data.note : undefined,
        order: data.order !== undefined ? parseInt(data.order, 10) : undefined,
      },
    });
  } catch (err) {
    console.warn("Prisma updateBucketItem fallback:", err.message);
  }

  const current = getLocalData();
  const currentBucket = (current.bucket || []).map((b) =>
    b.id === numId ? { ...b, ...data, id: numId } : b
  );
  saveLocalData({ bucket: currentBucket });
  triggerRevalidation();

  return updated || { id: numId, ...data };
}

export async function deleteBucketItem(id) {
  const numId = parseInt(id, 10);
  try {
    await prisma.bucketItem.delete({ where: { id: numId } });
  } catch (err) {
    console.warn("Prisma deleteBucketItem fallback:", err.message);
  }

  const current = getLocalData();
  const currentBucket = (current.bucket || []).filter((b) => b.id !== numId);
  saveLocalData({ bucket: currentBucket });
  triggerRevalidation();

  return { success: true };
}

// ==================== ADMIN AUTH ====================
export async function getAdminByUsername(username) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { username: username.trim() },
    });
    if (admin) return admin;
  } catch (err) {
    console.warn("Prisma getAdminByUsername fallback:", err.message);
  }

  const current = getLocalData();
  const admins = current.admins || defaultSeedData.admins || [];
  return admins.find((a) => a.username.toLowerCase() === username.trim().toLowerCase()) || null;
}

export async function updateAdminPassword(adminId, newPasswordHash) {
  try {
    await prisma.admin.update({
      where: { id: adminId },
      data: { passwordHash: newPasswordHash },
    });
  } catch (err) {
    console.warn("Prisma updateAdminPassword fallback:", err.message);
  }

  const current = getLocalData();
  const admins = (current.admins || defaultSeedData.admins || []).map((a) =>
    a.id === adminId ? { ...a, passwordHash: newPasswordHash } : a
  );
  saveLocalData({ admins });
  return true;
}
