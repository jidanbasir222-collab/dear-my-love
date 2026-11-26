import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst({
      where: { id: 1 },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 1,
          coupleName1: "Ahmad zaidan",
          coupleName2: "zaskia nisa syabani",
          anniversaryDate: "2026-09-08",
          websiteTitle: "OUR LITTLE UNIVERSE",
          tagline: "Every love story has a universe. This one is ours.",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pengaturan." },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Akses tidak sah." }, { status: 401 });
    }

    const body = await request.json();
    const {
      coupleName1,
      coupleName2,
      anniversaryDate,
      websiteTitle,
      tagline,
      heroPhoto,
      finalMessage,
      finalPhoto,
      themeColors,
    } = body;

    const updated = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {
        coupleName1: coupleName1 !== undefined ? coupleName1 : undefined,
        coupleName2: coupleName2 !== undefined ? coupleName2 : undefined,
        anniversaryDate: anniversaryDate !== undefined ? anniversaryDate : undefined,
        websiteTitle: websiteTitle !== undefined ? websiteTitle : undefined,
        tagline: tagline !== undefined ? tagline : undefined,
        heroPhoto: heroPhoto !== undefined ? heroPhoto : undefined,
        finalMessage: finalMessage !== undefined ? finalMessage : undefined,
        finalPhoto: finalPhoto !== undefined ? finalPhoto : undefined,
        themeColors: themeColors !== undefined ? (typeof themeColors === "string" ? themeColors : JSON.stringify(themeColors)) : undefined,
      },
      create: {
        id: 1,
        coupleName1: coupleName1 || "Ahmad zaidan",
        coupleName2: coupleName2 || "zaskia nisa syabani",
        anniversaryDate: anniversaryDate || "2026-09-08",
        websiteTitle: websiteTitle || "OUR LITTLE UNIVERSE",
        tagline: tagline || "Every love story has a universe. This one is ours.",
        heroPhoto: heroPhoto || "/images/hero.jpg",
        finalMessage: finalMessage || "Terima kasih telah menjadi bagian terindah dalam setiap hariku.",
        finalPhoto: finalPhoto || "/images/final.jpg",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pengaturan berhasil disimpan.",
      settings: updated,
    });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan pengaturan." },
      { status: 500 }
    );
  }
}
