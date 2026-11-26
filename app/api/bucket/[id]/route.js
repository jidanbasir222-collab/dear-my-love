import { NextResponse } from "next/server";
import { updateBucketItem, deleteBucketItem } from "@/lib/db-store";
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
    const { title, category, completed, completedDate, note, order } = await request.json();

    const updated = await updateBucketItem(id, {
      title,
      category,
      completed,
      completedDate,
      note,
      order: order !== undefined ? parseInt(order, 10) : undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Impian berhasil diperbarui.",
      item: updated,
    });
  } catch (error) {
    console.error("Update bucket item error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui impian." },
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
    await deleteBucketItem(id);

    return NextResponse.json({
      success: true,
      message: "Impian berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete bucket item error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus impian." },
      { status: 500 }
    );
  }
}
