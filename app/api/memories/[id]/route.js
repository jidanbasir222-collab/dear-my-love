import { NextResponse } from "next/server";
import { updateMemory, deleteMemory } from "@/lib/db-store";
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
    const { title, caption, date, photoUrl, category, rotation } = await request.json();

    const updated = await updateMemory(id, {
      title,
      caption,
      date,
      photoUrl,
      category,
      rotation: rotation !== undefined ? parseFloat(rotation) : undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Kenangan berhasil diperbarui.",
      memory: updated,
    });
  } catch (error) {
    console.error("Update memory error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui kenangan." },
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
    await deleteMemory(id);

    return NextResponse.json({
      success: true,
      message: "Kenangan berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete memory error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus kenangan." },
      { status: 500 }
    );
  }
}
