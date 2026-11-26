import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function PUT(request, { params }) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Akses tidak sah." }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    const { title, caption, date, photoUrl, category, rotation } = await request.json();

    const updated = await prisma.memory.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        caption: caption !== undefined ? caption : undefined,
        date: date !== undefined ? date : undefined,
        photoUrl: photoUrl !== undefined ? photoUrl : undefined,
        category: category !== undefined ? category : undefined,
        rotation: rotation !== undefined ? parseFloat(rotation) : undefined,
      },
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
    await prisma.memory.delete({
      where: { id },
    });

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
