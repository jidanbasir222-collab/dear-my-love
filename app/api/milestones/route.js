import { NextResponse } from "next/server";
import { getMilestones, createMilestone } from "@/lib/db-store";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const milestones = await getMilestones();
    return NextResponse.json(milestones);
  } catch (error) {
    console.error("Get milestones error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data linimasa perjalanan." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Akses tidak sah." }, { status: 401 });
    }

    const { date, title, description, photoUrl, location, order } = await request.json();

    if (!title || !date || !description) {
      return NextResponse.json(
        { error: "Judul, tanggal, dan deskripsi momen wajib diisi." },
        { status: 400 }
      );
    }

    const milestone = await createMilestone({
      date,
      title,
      description,
      photoUrl: photoUrl || null,
      location: location || null,
      order: order !== undefined ? parseInt(order, 10) : 0,
    });

    return NextResponse.json({
      success: true,
      message: "Momen linimasa berhasil ditambahkan.",
      milestone,
    });
  } catch (error) {
    console.error("Create milestone error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan momen linimasa." },
      { status: 500 }
    );
  }
}
