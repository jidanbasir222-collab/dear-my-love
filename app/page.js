import prisma from "@/lib/prisma";
import { MusicProvider } from "@/components/MusicContext";
import UniverseView from "@/components/UniverseView";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch initial data directly on the server
  let settings = await prisma.siteSettings.findFirst({ where: { id: 1 } });
  if (!settings) {
    settings = {
      coupleName1: "ahmad zaidan",
      coupleName2: "zaskia nisa syabani",
      anniversaryDate: "2023-11-22T00:00:00",
      websiteTitle: "OUR LITTLE UNIVERSE",
      tagline: "Every love story has a universe. This one is ours.",
      heroPhoto: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80",
      finalMessage: "Terima kasih telah menjadi bagian terindah dalam setiap hariku. Bersamamu, hal-hal sederhana terasa begitu luar biasa.",
      finalPhoto: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80",
    };
  }

  const milestones = await prisma.timelineMilestone.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });

  const memories = await prisma.memory.findMany({
    orderBy: { createdAt: "desc" },
  });

  const letter = await prisma.letter.findFirst({ where: { id: 1 } });
  const surprise = await prisma.surprise.findFirst({ where: { id: 1 } });
  const bucketItems = await prisma.bucketItem.findMany({
    orderBy: [{ order: "asc" }, { id: "asc" }],
  });

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
