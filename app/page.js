import {
  getSettings,
  getMilestones,
  getMemories,
  getLetter,
  getSurprise,
  getBucketItems,
  getSongs,
} from "@/lib/db-store";
import { MusicProvider } from "@/components/MusicContext";
import UniverseView from "@/components/UniverseView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [
    settings,
    milestones,
    memories,
    letter,
    surprise,
    bucketItems,
    songs,
  ] = await Promise.all([
    getSettings(),
    getMilestones(),
    getMemories(),
    getLetter(),
    getSurprise(),
    getBucketItems(),
    getSongs(),
  ]);

  return (
    <MusicProvider initialSongs={songs}>
      <UniverseView
        settings={settings}
        milestones={milestones}
        memories={memories}
        letter={letter}
        surprise={surprise}
        bucketItems={bucketItems}
        songs={songs}
      />
    </MusicProvider>
  );
}
