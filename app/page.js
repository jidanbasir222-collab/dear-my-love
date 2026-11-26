import prisma from "@/lib/prisma";
import { MusicProvider } from "@/components/MusicContext";
import UniverseView from "@/components/UniverseView";
import defaultData from "@/prisma/seed-data.json";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let settings = defaultData.settings;
  let milestones = defaultData.milestones;
  let memories = defaultData.memories;
  let letter = defaultData.letter;
  let surprise = defaultData.surprise;
  let bucketItems = defaultData.bucket;

  try {
    const [
      dbSettings,
      dbMilestones,
      dbMemories,
      dbLetter,
      dbSurprise,
      dbBucket,
    ] = await Promise.all([
      prisma.siteSettings.findFirst({ where: { id: 1 } }),
      prisma.timelineMilestone.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] }),
      prisma.memory.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.letter.findFirst({ where: { id: 1 } }),
      prisma.surprise.findFirst({ where: { id: 1 } }),
      prisma.bucketItem.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] }),
    ]);

    if (dbSettings) settings = dbSettings;
    if (dbMilestones && dbMilestones.length > 0) milestones = dbMilestones;
    if (dbMemories && dbMemories.length > 0) memories = dbMemories;
    if (dbLetter) letter = dbLetter;
    if (dbSurprise) surprise = dbSurprise;
    if (dbBucket && dbBucket.length > 0) bucketItems = dbBucket;
  } catch (error) {
    console.warn("Database fetch warning (using default data fallback):", error.message);
  }

  return (
    <MusicProvider>
      <UniverseView
        settings={settings}
        milestones={milestones}
        memories={memories}
        letter={letter}
        surprise={surprise}
        bucketItems={bucketItems}
      />
    </MusicProvider>
  );
}
