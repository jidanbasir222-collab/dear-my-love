import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where = category && category !== "Semua" ? { category } : {};

    const memories = await prisma.memory.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(memories);
  } catch (error) {
    console.error("Get memories error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data galeri kenangan." },
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

    const { title, caption, date, photoUrl, category, rotation } = await request.json();

    if (!title || !photoUrl || !date) {
      return NextResponse.json(
        { error: "Judul, foto, dan tanggal kenangan wajib diisi." },
        { status: 400 }
      );
    }

    // Default random slight polaroid angle between -3 and 3 degrees
    const randomRot = (Math.random() * 6 - 3).toFixed(1);

    const memory = await prisma.memory.create({
      data: {
        title,
        caption: caption || "",
        date,
        photoUrl,
        category: category || "Momen Spesial",
        rotation: rotation !== undefined ? parseFloat(rotation) : parseFloat(randomRot),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Kenangan polaroid berhasil ditambahkan.",
      memory,
    });
  } catch (error) {
    console.error("Create memory error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan kenangan." },
      { status: 500 }
    );
  }
}
