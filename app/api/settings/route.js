import { NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/db-store";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const settings = await getSettings();
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

    const updated = await updateSettings({
      coupleName1,
      coupleName2,
      anniversaryDate,
      websiteTitle,
      tagline,
      heroPhoto,
      finalMessage,
      finalPhoto,
      themeColors,
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
