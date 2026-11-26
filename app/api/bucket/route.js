import { NextResponse } from "next/server";
import { getBucketItems, createBucketItem } from "@/lib/db-store";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const items = await getBucketItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Get bucket items error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil daftar impian masa depan." },
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

    const { title, category, completed, completedDate, note, order } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Judul impian wajib diisi." },
        { status: 400 }
      );
    }

    const item = await createBucketItem({
      title,
      category: category || "Mimpi Bersama",
      completed: Boolean(completed),
      completedDate: completedDate || null,
      note: note || null,
      order: order !== undefined ? parseInt(order, 10) : 0,
    });

    return NextResponse.json({
      success: true,
      message: "Impian berhasil ditambahkan.",
      item,
    });
  } catch (error) {
    console.error("Create bucket item error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan impian." },
      { status: 500 }
    );
  }
}
