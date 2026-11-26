import { NextResponse } from "next/server";
import { updateSong, deleteSong } from "@/lib/db-store";
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

    const updated = await updateSong(id, {
      title,
      artist,
      audioUrl,
      coverUrl,
      duration,
      order: order !== undefined ? parseInt(order, 10) : undefined,
      isDefault: isDefault !== undefined ? Boolean(isDefault) : undefined,
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
    await deleteSong(id);

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
