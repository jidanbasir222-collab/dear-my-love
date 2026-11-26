import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      orderBy: [{ order: "asc" }, { id: "asc" }],
    });
    return NextResponse.json(songs);
  } catch (error) {
    console.error("Get songs error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar lagu cinta." },
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

    const { title, artist, audioUrl, coverUrl, duration, order, isDefault } = await request.json();

    if (!title || !artist || !audioUrl) {
      return NextResponse.json(
        { error: "Judul, penyanyi, dan URL audio lagu wajib diisi." },
        { status: 400 }
      );
    }

    if (isDefault) {
      await prisma.song.updateMany({
        data: { isDefault: false },
      });
    }

    const song = await prisma.song.create({
      data: {
        title,
        artist,
        audioUrl,
        coverUrl: coverUrl || null,
        duration: duration || "3:30",
        order: order !== undefined ? parseInt(order, 10) : 0,
        isDefault: Boolean(isDefault),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Lagu berhasil ditambahkan ke playlist.",
      song,
    });
  } catch (error) {
    console.error("Create song error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan lagu." },
      { status: 500 }
    );
  }
}
