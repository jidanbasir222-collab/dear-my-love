import { NextResponse } from "next/server";
import { updateMilestone, deleteMilestone } from "@/lib/db-store";
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
    const { date, title, description, photoUrl, location, order } = await request.json();

    const updated = await updateMilestone(id, {
      date,
      title,
      description,
      photoUrl,
      location,
      order: order !== undefined ? parseInt(order, 10) : undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Momen linimasa berhasil diperbarui.",
      milestone: updated,
    });
  } catch (error) {
    console.error("Update milestone error:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui momen linimasa." },
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
    await deleteMilestone(id);

    return NextResponse.json({
      success: true,
      message: "Momen linimasa berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete milestone error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus momen linimasa." },
      { status: 500 }
    );
  }
}
