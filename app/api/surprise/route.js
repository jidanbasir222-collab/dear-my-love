import { NextResponse } from "next/server";
import { getSurprise, updateSurprise } from "@/lib/db-store";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const surprise = await getSurprise();
    return NextResponse.json(surprise);
  } catch (error) {
    console.error("Get surprise error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kejutan." },
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

    const { boxTitle, boxSubtitle, message, photoUrl, badge, couponText } = await request.json();

    const updated = await updateSurprise({
      boxTitle,
      boxSubtitle,
      message,
      photoUrl,
      badge,
      couponText,
    });

    return NextResponse.json({
      success: true,
      message: "Kejutan berhasil diperbarui.",
      surprise: updated,
    });
  } catch (error) {
    console.error("Update surprise error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui kejutan." },
      { status: 500 }
    );
  }
}
