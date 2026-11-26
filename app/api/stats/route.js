import { NextResponse } from "next/server";
import { getMemories, getMilestones, getSongs, getBucketItems } from "@/lib/db-store";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Akses tidak sah." }, { status: 401 });
    }

    const [memories, milestones, songs, bucketItems] = await Promise.all([
      getMemories(),
      getMilestones(),
      getSongs(),
      getBucketItems(),
    ]);

    const totalBucket = (bucketItems || []).length;
    const completedBucket = (bucketItems || []).filter((item) => item.completed).length;
    const bucketPercentage = totalBucket > 0 ? Math.round((completedBucket / totalBucket) * 100) : 0;

    return NextResponse.json({
      memoriesCount: (memories || []).length,
      milestonesCount: (milestones || []).length,
      songsCount: (songs || []).length,
      totalBucket,
      completedBucket,
      bucketPercentage,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil statistik dashboard." },
      { status: 500 }
    );
  }
}
