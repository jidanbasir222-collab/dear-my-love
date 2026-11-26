import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function PUT(request, { params }) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Akses tidak sah." }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    const { title, artist, audioUrl, coverUrl, duration, order, isDefault } = await request.json();

    if (isDefault) {
      await prisma.song.updateMany({
        where: { id: { not: id } },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.song.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        artist: artist !== undefined ? artist : undefined,
        audioUrl: audioUrl !== undefined ? audioUrl : undefined,
        coverUrl: coverUrl !== undefined ? coverUrl : undefined,
        duration: duration !== undefined ? duration : undefined,
        order: order !== undefined ? parseInt(order, 10) : undefined,
        isDefault: isDefault !== undefined ? Boolean(isDefault) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data lagu berhasil diperbarui.",
      song: updated,
    });
  } catch (error) {
    console.error("Update song error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui lagu." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Akses tidak sah." }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    await prisma.song.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Lagu berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete song error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus lagu." },
      { status: 500 }
    );
  }
}
