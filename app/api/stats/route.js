import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Akses tidak sah." }, { status: 401 });
    }

    const [memoriesCount, milestonesCount, songsCount, bucketItems] = await Promise.all([
      prisma.memory.count(),
      prisma.timelineMilestone.count(),
      prisma.song.count(),
      prisma.bucketItem.findMany(),
    ]);

    const totalBucket = bucketItems.length;
    const completedBucket = bucketItems.filter((item) => item.completed).length;
    const bucketPercentage = totalBucket > 0 ? Math.round((completedBucket / totalBucket) * 100) : 0;

    return NextResponse.json({
      memoriesCount,
      milestonesCount,
      songsCount,
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
